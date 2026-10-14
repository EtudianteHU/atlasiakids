
import { Router } from "express";
import {
  Client,
  Environment,
  OrdersController,
  CheckoutPaymentIntent,
} from "@paypal/paypal-server-sdk";

import mongoose from "mongoose";
import Issue from "../models/Issue.js";
import Order from "../models/Order.js";

const router = Router();

// ==================================================
// PAYPAL CLIENT
// ==================================================

const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },

  environment:
    process.env.PAYPAL_ENVIRONMENT === "production"
      ? Environment.Production
      : Environment.Sandbox,
});

const ordersController = new OrdersController(paypalClient);

// ==================================================
// CREATE PAYPAL ORDER
// ==================================================

router.post("/create-order", async (req, res) => {
  try {
    console.log("🔥 PAYPAL CREATE ORDER");
    console.log("BODY:", req.body);

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
    // ==================================================

    const subscriptions = items.filter(
      (item) => item.type === "subscription"
    );

    let catalogItems = [];

    // --------------------------------------------------
    // ABONNEMENT 84 €
    // --------------------------------------------------

    if (subscriptions.length > 0) {
      const plan =
        subscriptions[0].productId;

      if (plan !== "abonnement_annuel") {
        return res.status(400).json({
          message: "Plan d'abonnement invalide",
        });
      }

      catalogItems = [
        {
          productId: "abonnement_annuel",
          name: "Abonnement Atlasia Kids - Annuel",
          price: 84,
          quantity: 1,
          image: null,
        },
      ];
    }

    // ==================================================
    // PRODUITS NORMAUX
    // ==================================================

    else {
      const products = items.filter(
        (item) =>
          item.type !== "subscription" &&
          mongoose.Types.ObjectId.isValid(
            item.productId
          )
      );

      if (products.length === 0) {
        return res.status(400).json({
          message: "Aucun produit valide",
        });
      }

      // ------------------------------------------------
      // RÉCUPÉRATION MONGODB
      // ------------------------------------------------

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

      // ------------------------------------------------
      // CONSTRUCTION DU CATALOGUE
      // ------------------------------------------------

      catalogItems = products.map((item) => {
        const issue = issueMap.get(
          String(item.productId)
        );

        if (!issue) {
          throw new Error(
            `Produit introuvable : ${item.productId}`
          );
        }

        const price = Number(issue.price);

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
    }

    // ==================================================
    // CALCUL SERVEUR
    // ==================================================

    const total = catalogItems.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0
    );

    const totalFormatted =
      total.toFixed(2);

    console.log(
      "💰 PAYPAL TOTAL:",
      totalFormatted,
      "EUR"
    );

    // ==================================================
    // PAYPAL ITEMS
    // ==================================================

    const paypalItems =
      catalogItems.map((item) => ({
        name: item.name.substring(0, 127),

        quantity: String(
          item.quantity
        ),

        unitAmount: {
          currencyCode: "EUR",

          value:
            Number(item.price).toFixed(2),
        },
      }));

    // ==================================================
    // CREATE PAYPAL ORDER
    // ==================================================

    const response =
      await ordersController.createOrder({
        body: {
          intent:
            CheckoutPaymentIntent.Capture,

          purchaseUnits: [
            {
              amount: {
                currencyCode: "EUR",

                value:
                  totalFormatted,

                breakdown: {
                  itemTotal: {
                    currencyCode: "EUR",

                    value:
                      totalFormatted,
                  },
                },
              },

              items: paypalItems.map(
                (item) => ({
                  name: item.name,
                  quantity:
                    item.quantity,

                  unitAmount:
                    item.unitAmount,
                })
              ),

              customId: email,
            },
          ],
        },

        prefer: "return=representation",
      });

    const paypalOrder =
      response.result;

    if (!paypalOrder?.id) {
      throw new Error(
        "PayPal n'a pas retourné d'ID de commande"
      );
    }

    console.log(
      "✅ PAYPAL ORDER CRÉÉE:",
      paypalOrder.id
    );

    // ==================================================
    // RÉPONSE REACT
    // ==================================================

    return res.json({
      id: paypalOrder.id,
    });

  } catch (err) {
    console.error(
      "❌ PAYPAL CREATE ERROR:",
      err
    );

    return res.status(500).json({
      message:
        err.message ||
        "Erreur lors de la création de la commande PayPal",
    });
  }
});

// ==================================================
// CAPTURE PAYPAL ORDER
// ==================================================

router.post(
  "/capture-order",
  async (req, res) => {
    try {
      const {
        orderID,
        customer,
        email,
        items,
      } = req.body;

      if (!orderID) {
        return res.status(400).json({
          message:
            "PayPal orderID manquant",
        });
      }

      console.log(
        "💳 PAYPAL CAPTURE:",
        orderID
      );

      // ==================================================
      // CAPTURE
      // ==================================================

      const response =
        await ordersController.captureOrder({
          id: orderID,

          prefer:
            "return=representation",
        });

      const paypalOrder =
        response.result;

      console.log(
        "PAYPAL STATUS:",
        paypalOrder?.status
      );

      if (
        paypalOrder?.status !==
        "COMPLETED"
      ) {
        return res.status(400).json({
          message:
            "Le paiement PayPal n'est pas confirmé.",
          status:
            paypalOrder?.status,
        });
      }

      // ==================================================
      // RÉCUPÉRER LE MONTANT PAYPAL
      // ==================================================

      const purchaseUnit =
        paypalOrder
          ?.purchaseUnits?.[0];

      const paypalAmount =
        Number(
          purchaseUnit
            ?.payments
            ?.captures?.[0]
            ?.amount
            ?.value || 0
        );

      if (
        !Number.isFinite(
          paypalAmount
        ) ||
        paypalAmount <= 0
      ) {
        throw new Error(
          "Montant PayPal invalide"
        );
      }

      // ==================================================
      // CONSTRUIRE LES ARTICLES
      // ==================================================

      const rawItems =
        Array.isArray(items)
          ? items
          : [];

      const normalizedItems =
        rawItems
          .map((item) => ({
            issueId:
              String(
                item.productId
              ),

            title:
              item.title || "",

            price:
              Number(
                item.price || 0
              ),

            quantity:
              Math.max(
                1,
                Number(
                  item.quantity || 1
                )
              ),

            image:
              item.image || "",
          }));

      // ==================================================
      // CRÉER LA COMMANDE MONGODB
      // ==================================================

      const order =
        await Order.create({
          customer: {
            email:
              email ||
              customer?.email ||
              "",

            firstName:
              customer?.firstName ||
              "",

            lastName:
              customer?.lastName ||
              "",

            company:
              customer?.company ||
              "",

            address:
              customer?.address ||
              "",

            postalCode:
              customer?.postalCode ||
              "",

            city:
              customer?.city ||
              "",

            country:
              customer?.country ||
              "France",

            phone:
              customer?.phone ||
              "",
          },

          items:
            normalizedItems,

          subtotal:
            paypalAmount,

          total:
            paypalAmount,

          paymentMethod:
            "paypal",

          status:
            "paid",
        });

      console.log(
        "✅ COMMANDE PAYPAL MONGODB:",
        order._id
      );

      // ==================================================
      // RÉPONSE
      // ==================================================

      return res.json({
        success: true,

        orderId:
          order._id,

        paypalOrderId:
          orderID,

        status:
          "COMPLETED",
      });

    } catch (err) {
      console.error(
        "❌ PAYPAL CAPTURE ERROR:",
        err
      );

      return res.status(500).json({
        message:
          err.message ||
          "Erreur lors de la capture PayPal",
      });
    }
  }
);

export default router;

