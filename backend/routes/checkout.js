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
        quantity: Math.max(
          1,
          Number(item?.quantity || 1)
        ),
        type: item?.type,
      }))
      .filter((item) => item.productId);

    if (items.length === 0) {
      return res.status(400).json({
        message: "Panier vide",
      });
    }

    // ==================================================
    // CLIENT
    // ==================================================

    const customer = req.body?.customer || {};

    const email =
      req.body?.email ||
      customer.email ||
      "";

    // ==================================================
    // ABONNEMENT ANNUEL
    // 84 € EN UNE SEULE FOIS
    // ==================================================

    const subscriptions = items.filter(
      (item) => item.type === "subscription"
    );

    if (subscriptions.length > 0) {
      const plan =
        subscriptions[0].productId;

      // --------------------------------------------------
      // Vérification du plan
      // --------------------------------------------------

      if (plan !== "abonnement_annuel") {
        return res.status(400).json({
          message: "Plan d'abonnement invalide",
        });
      }

      // --------------------------------------------------
      // PRIX FIXE SERVEUR
      // --------------------------------------------------

      const price = 84;
      const unitAmount = 8400;

      const planName =
        "Abonnement Atlasia Kids - Annuel";

      console.log(
        "🔥 ABONNEMENT ANNUEL"
      );

      console.log(
        "💰 Prix :",
        price,
        "€"
      );

      console.log(
        "💳 Paiement unique"
      );

      console.log(
        "❌ Aucun renouvellement automatique"
      );

      // ==================================================
      // STRIPE CHECKOUT
      // ==================================================

      const session =
        await stripe.checkout.sessions.create({
          mode: "payment",

          payment_method_types: [
            "card",
          ],
          payment_intent_data: {
  payment_method_options: {
    card: {
      request_three_d_secure:"challenge",
    },
  },
},
          line_items: [
            {
              price_data: {
                currency: "eur",

                product_data: {
                  name: planName,
                  description:
                    "Accès annuel Atlasia Kids - 12 mois",
                },

                unit_amount: unitAmount,
              },

              quantity: 1,
            },
          ],

          // ==================================================
          // EMAIL CLIENT
          // ==================================================

          customer_email:
            email || undefined,

          // ==================================================
          // METADATA
          // ==================================================

          metadata: {
            type: "payment",

            email,

            plan: "annuel",

            price: "84",

            durationMonths: "12",

            firstName:
              customer.firstName || "",

            lastName:
              customer.lastName || "",
                phone:
              customer.phone || "",
company:
  customer.company || "",

            address:
              customer.address || "",

            postalCode:
              customer.postalCode || "",

            city:
              customer.city || "",

            country:
              customer.country ||
              "France",
          },

          // ==================================================
          // URLS
          // ==================================================

          success_url:
            `${process.env.FRONT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `${process.env.FRONT_URL}/cancel`,
        });

      console.log(
        "✅ STRIPE SESSION ABONNEMENT CRÉÉE"
      );

      console.log(
        "SESSION ID:",
        session.id
      );

      console.log(
        "SESSION URL:",
        session.url
      );

      console.log(
        "💰 84 € PAYÉS EN UNE SEULE FOIS"
      );

      return res.json({
        url: session.url,
        sessionId: session.id,
      });
    }

    // ==================================================
    // PRODUITS NORMAUX
    // PAIEMENT UNIQUE
    // ==================================================

    const products = items.filter(
      (item) =>
        item.type !== "subscription" &&
        mongoose.Types.ObjectId.isValid(
          item.productId
        )
    );

    if (products.length === 0) {
      return res.status(400).json({
        message:
          "Aucun produit valide",
      });
    }

    // ==================================================
    // RÉCUPÉRER LES PRODUITS MONGODB
    // ==================================================

    const issues = await Issue.find({
      _id: {
        $in: products.map(
          (item) => item.productId
        ),
      },
    });

    const issueMap = new Map(
      issues.map((issue) => [
        issue._id.toString(),
        issue,
      ])
    );

    // ==================================================
    // CONSTRUIRE LES PRODUITS
    // ==================================================

    const catalogItems =
      products.map((item) => {
        const issue =
          issueMap.get(
            String(item.productId)
          );

        if (!issue) {
          throw new Error(
            `Produit introuvable : ${item.productId}`
          );
        }

        const price =
          Number(issue.price);

        if (
          !Number.isFinite(price) ||
          price < 0
        ) {
          throw new Error(
            `Prix invalide pour : ${issue.title}`
          );
        }

        return {
          productId:
            issue._id.toString(),

          name:
            issue.title,

          price,

          quantity:
            item.quantity,

          image:
            issue.image,
        };
      });

    // ==================================================
    // STRIPE LINE ITEMS
    // ==================================================

    const line_items =
      catalogItems.map(
        (item) => ({
          price_data: {
            currency: "eur",

            product_data: {
              name: item.name,

              images: item.image
                ? [item.image]
                : [],
            },

            unit_amount:
              Math.round(
                item.price * 100
              ),
          },

          quantity:
            item.quantity,
        })
      );

    if (line_items.length === 0) {
      throw new Error(
        "Stripe refuse : line_items vide"
      );
    }

    // ==================================================
    // STRIPE PAYMENT
    // ==================================================

  const session =
  await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: [
      "card",
    ],

    payment_method_options: {
      card: {
        request_three_d_secure:  "challenge",
      },
    },

    line_items,

customer_email:
  email || undefined,

        // ==================================================
        // URLS
        // ==================================================

        success_url:
          `${process.env.FRONT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.FRONT_URL}/cancel`,

        // ==================================================
        // METADATA
        // ==================================================

        metadata: {
          type: "order",

          email,

          firstName:
            customer.firstName || "",

          lastName:
            customer.lastName || "",
company:
  customer.company || "",
          address:
            customer.address || "",
            phone:
  customer.phone || "",

          city:
            customer.city || "",

          postalCode:
            customer.postalCode || "",

          country:
            customer.country ||
            "France",

          itemsCount:
            String(products.length),
        },
      });

    console.log(
      "✅ STRIPE PAYMENT SESSION CRÉÉE"
    );

    console.log(
      "SESSION ID:",
      session.id
    );

    console.log(
      "SESSION URL:",
      session.url
    );

    return res.json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (err) {
    console.error(
      "❌ CHECKOUT ERROR:",
      err
    );

    return res.status(500).json({
      message:
        err.message ||
        "Erreur lors de la création du paiement",
    });
  }
});

// ==================================================
// GET SESSION
// ==================================================

router.get(
  "/session/:id",
  async (req, res) => {
    try {
      const session =
        await stripe.checkout.sessions.retrieve(
          req.params.id
        );

      return res.json(session);

    } catch (err) {
      console.error(
        "❌ SESSION ERROR:",
        err
      );

      return res.status(500).json({
        message:
          err.message,
      });
    }
  }
);

export default router;