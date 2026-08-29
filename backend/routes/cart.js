import { Router } from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import Issue from "../models/Issue.js";

const router = Router();
console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY); // 👈 AJOUTE ICI

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-session", async (req, res, next) => {
  try {
    // =========================
    // 1. INPUTS
    // =========================
    const items = Array.isArray(req.body?.items) ? req.body.items : [];

    const customer =
      req.body?.customer && typeof req.body.customer === "object"
        ? req.body.customer
        : {};

    const email =
      typeof req.body?.email === "string"
        ? req.body.email.toLowerCase().trim()
        : undefined;

    if (items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    if (items.length > 50) {
      return res.status(400).json({ message: "Trop d'articles" });
    }

    // =========================
    // 2. VALIDATION IDS
    // =========================
    for (const item of items) {
     if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: "ID produit invalide" });
      }
    }

    // =========================
    // 3. LOAD PRODUITS
    // =========================
 const ids = items.map((i) => i.productId);

const issues = await Issue.find({
  _id: { $in: ids },
});

const issuesMap = new Map(
  issues.map((i) => [i._id.toString(), i])
);


    // =========================
    // 4. VALIDATION + STOCK
// =========================
const catalogItems = items.map((item) => {
 const issue = issuesMap.get(item.productId.toString());

  if (!issue) {
    throw new Error(`Produit invalide : ${item.productId}`);
  }

  if (issue.isSoldOut) {
    throw new Error(`Produit indisponible : ${issue.title}`);
  }

  const quantity = Math.min(
    Math.max(parseInt(item.quantity, 10) || 1, 1),
    10
  );

  if (issue.stock < quantity) {
    throw new Error(`Stock insuffisant : ${issue.title}`);
  }

  return {
    id: item.productId,
    name: issue.title,
    price: Number(issue.price),
    image: issue.image,
    quantity,
  };
});

    // =========================
    // 5. STRIPE LINE ITEMS
    // =========================
    const line_items = catalogItems.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // =========================
    // 6. CREATE SESSION
    // =========================
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,

      success_url: `${process.env.FRONT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_URL}/cancel`,

      customer_email: email,

      billing_address_collection: "required",

      automatic_tax: {
        enabled: true,
      },

      client_reference_id: email || "guest",

      metadata: {
        items: JSON.stringify(catalogItems),
        customer: JSON.stringify(customer),
      },
    });

    // =========================
    // 7. RESPONSE
    // =========================
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

export default router;