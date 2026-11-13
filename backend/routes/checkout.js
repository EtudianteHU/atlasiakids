import { Router } from "express";
import Stripe from "stripe";
import Issue from "../models/Issue.js";
import mongoose from "mongoose";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log(
  "Stripe mode:",
  process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")
    ? "LIVE"
    : process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")
    ? "TEST"
    : "INCONNU"
);

// ==================================================
// CREATE SESSION
// ==================================================

router.post("/create-session", async (req, res) => {
  try {
    console.log("🔥 REQUEST BODY:", req.body);

    // ==================================================
    // PANIER
    // ==================================================

    const rawItems = Array.isArray(req.body?.items)
      ? req.body.items
      : [];

    const items = rawItems
      .map((item) => ({
        productId: item?.productId,
        quantity: Math.max(1, Number(item?.quantity || 1)),
        type: item?.type,
      }))
      .filter((item) => item.productId);

    if (items.length === 0) {
      return res.status(400).json({
        message: "Panier vide",
      });
    }

    // ==================================================
    // CLIENT & ÜLKE KONTROLÜ
    // ==================================================

    const customer = req.body?.customer || {};

    const email =
      req.body?.email ||
      customer.email ||
      "";

    const isSuisse =
      String(customer.country || "").trim().toLowerCase() === "suisse";

    // ==================================================
    // ABONNEMENT ANNUEL
    // FRANSA: 84 € | İSVİÇRE: 94 €
    // ==================================================

    const subscriptions = items.filter(
      (item) => item.type === "subscription"
    );

    if (subscriptions.length > 0) {
      const plan = subscriptions[0].productId;

      if (plan !== "abonnement_annuel") {
        return res.status(400).json({
          message: "Plan d'abonnement invalide",
        });
      }

      const price = isSuisse ? 94 : 84;
      const unitAmount = isSuisse ? 9400 : 8400;

      const planName = isSuisse
        ? "Abonnement Atlasia Kids - Annuel (Suisse - Livraison incluse)"
        : "Abonnement Atlasia Kids - Annuel";

      console.log("🔥 ABONNEMENT ANNUEL");
      console.log("🌍 Pays :", customer.country || "France");
      console.log("💰 Prix :", price, "€");

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        payment_method_options: {
          card: {
            request_three_d_secure: "challenge",
          },
        },
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: planName,
                description: "Accès annuel Atlasia Kids - 12 mois",
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        customer_email: email || undefined,
        metadata: {
          type: "payment",
          email,
          plan: "annuel",
          price: String(price),
          durationMonths: "12",
          firstName: customer.firstName || "",
          lastName: customer.lastName || "",
          phone: customer.phone || "",
          company: customer.company || "",
          address: customer.address || "",
          postalCode: customer.postalCode || "",
          city: customer.city || "",
          country: customer.country || "France",
        },
        success_url: `${process.env.FRONT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONT_URL}/cancel`,
      });

      console.log("✅ STRIPE SESSION ABONNEMENT CRÉÉE");
      console.log("SESSION ID:", session.id);

      return res.json({
        url: session.url,
        sessionId: session.id,
      });
    }

    // ==================================================
    // PRODUITS NORMAUX
    // FRANSA: NORMAL FİYAT | İSVİÇRE: 8,99 € (KARGO DAHİL)
    // ==================================================

    const products = items.filter(
      (item) =>
        item.type !== "subscription" &&
        mongoose.Types.ObjectId.isValid(item.productId)
    );

    if (products.length === 0) {
      return res.status(400).json({
        message: "Aucun produit valide",
      });
    }

    const issues = await Issue.find({
      _id: {
        $in: products.map((item) => item.productId),
      },
    });

    const issueMap = new Map(
      issues.map((issue) => [issue._id.toString(), issue])
    );

    const catalogItems = products.map((item) => {
      const issue = issueMap.get(String(item.productId));

      if (!issue) {
        throw new Error(`Produit introuvable : ${item.productId}`);
      }

      const price = isSuisse ? 8.99 : Number(issue.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error(`Prix invalide pour : ${issue.title}`);
      }

      return {
        productId: issue._id.toString(),
        name: isSuisse
          ? `${issue.title} (Suisse - Livraison incluse)`
          : issue.title,
        price,
        quantity: item.quantity,
        image: issue.image,
      };
    });

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

    if (line_items.length === 0) {
      throw new Error("Stripe refuse : line_items vide");
    }

    // ==================================================
    // STRIPE PAYMENT (NORMAL PRODUITS)
    // ==================================================

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      payment_method_options: {
        card: {
          request_three_d_secure: "challenge",
        },
      },
      line_items,
      customer_email: email || undefined,
      metadata: {
        type: "product_payment",
        email,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phone: customer.phone || "",
        company: customer.company || "",
        address: customer.address || "",
        postalCode: customer.postalCode || "",
        city: customer.city || "",
        country: customer.country || "France",
      },
      success_url: `${process.env.FRONT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_URL}/cancel`,
    });

    console.log("✅ STRIPE SESSION PRODUIT CRÉÉE");
    console.log("SESSION ID:", session.id);

    return res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("❌ ERREUR CREATE SESSION:", err);
    return res.status(500).json({
      message: err.message || "Erreur serveur lors du paiement",
    });
  }
});

export default router;
