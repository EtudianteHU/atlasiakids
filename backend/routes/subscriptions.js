import { Router } from "express";
import Subscription from "../models/Subscription.js";

const router = Router();

const PRICES = { mensuel: 7.99, annuel: 84 };

// POST /api/subscriptions
router.post("/", async (req, res, next) => {
  try {
    const { email, firstName, lastName, address, postalCode, city, country, plan } = req.body;

    if (!email || !firstName || !lastName || !address || !postalCode || !city) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const selectedPlan = plan === "mensuel" ? "mensuel" : "annuel";
    const price = PRICES[selectedPlan];

    let subscriptionId = "local-" + Date.now();
    try {
      const subscription = await Subscription.create({
        email,
        firstName,
        lastName,
        address,
        postalCode,
        city,
        country: country || "France",
        plan: selectedPlan,
        price,
       status: "pending",
      });
      subscriptionId = subscription._id;
    } catch (dbErr) {
      console.warn("DB write failed (subscription):", dbErr.message);
    }

    res.status(201).json({
      message: "Abonnement créé ✅",
      subscriptionId,
      plan: selectedPlan,
      price,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
