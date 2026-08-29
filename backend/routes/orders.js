import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Issue from "../models/Issue.js";
import nodemailer from "nodemailer";

const router = Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
    tls: {
    rejectUnauthorized: false, // 👈 AJOUTE ÇA
  },
});
router.post("/", async (req, res, next) => {
    console.log("🔥 ROUTE HIT");
  const session = await mongoose.startSession();

  try { 
      console.log("1");
const { email, customer, items, paymentMethod } = req.body;
console.log("2");

    // 1. VALIDATION CLIENT
    // -------------------------
if (!email || !customer?.firstName || !customer?.lastName) {
      return res
        .status(400)
        .json({ message: "Informations client manquantes" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Le panier est vide" });
    }

    // -------------------------
    // 2. START TRANSACTION
    // -------------------------
    session.startTransaction();

    // -------------------------
    // 3. RÉCUPÉRER PRODUITS
    // -------------------------
const ids = items.map(i => i.productId || i._id);

const issues = await Issue.find({
  _id: { $in: ids },
});

    // Optimisation lookup
  const issuesMap = new Map(
  issues.map((p) => [p._id.toString(), p])
);

    const dbItems = [];

    // -------------------------
    // 4. TRAITEMENT ITEMS + STOCK
    // -------------------------
    for (const item of items) {
      console.log("productId:", item.productId);
console.log("type:", typeof item.productId);
const issue = issuesMap.get(item.productId?.toString());

      if (!issue) {
        throw new Error("Produit invalide");
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      const updatedIssue = await Issue.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedIssue) {
        throw new Error(`Stock insuffisant pour ${issue.title}`);
      }

      dbItems.push({
        issueId: updatedIssue._id,
        title: updatedIssue.title,
        price: updatedIssue.price,
        quantity,
        image: updatedIssue.image,
      });
    }

    // -------------------------
    // 5. CALCUL TOTAL
    // -------------------------
    const subtotal = dbItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // -------------------------
    // 6. CRÉATION COMMANDE
    // -------------------------
  const order = await Order.create(
  [
    {
      customer,
      items: dbItems,
      subtotal,
      total: subtotal,
      paymentMethod: paymentMethod || "cash_on_delivery",

      stripeSessionId: null, // 👈 CORRECT
    },
  ],
  { session }
);
console.log("3 EMAIL");
    // -------------------------
    // 7. COMMIT
    // -------------------------
await session.commitTransaction();
session.endSession();
console.log("4 BEFORE SENDMAIL");
try { 
const info = await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Confirmation de votre commande",
  html: `
    <h2>Merci ${customer.firstName} ${customer.lastName} 🎉</h2>
    <p>Votre commande a bien été enregistrée.</p>
    <p><strong>Commande ID :</strong> ${order[0]._id}</p>
    <p><strong>Total :</strong> ${subtotal} €</p>
  `,
});

  console.log("📩 Email envoyé !");
  console.log("Response SMTP:", info.response);

} catch (emailErr) {
  console.error("❌ Email error:", emailErr);
}
    // -------------------------
    // 8. RESPONSE
    // -------------------------
    return res.status(201).json({
      message: "Commande créée ✅",
      orderId: order[0]._id,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    // Gestion propre erreurs
    if (err.message.includes("Stock insuffisant")) {
      return res.status(400).json({ message: err.message });
    }

    if (err.message.includes("Produit invalide")) {
      return res.status(400).json({ message: err.message });
    }

    next(err);
  }
});

export default router;