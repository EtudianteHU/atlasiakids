
import { Router } from "express";
import Stripe from "stripe";
import { Resend } from "resend";
import Order from "../models/Order.js";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// ==========================================
// STRIPE WEBHOOK
// ==========================================

router.post("/", async (req, res) => {
  console.log("🔥 STRIPE WEBHOOK GELDİ");

  const signature = req.headers["stripe-signature"];

  let event;

  // ==========================================
  // STRIPE SIGNATURE
  // ==========================================

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(
      "❌ Stripe Webhook Signature Error:",
      err.message
    );

    return res.status(400).send(
      `Webhook Error: ${err.message}`
    );
  }

  console.log("=================================");
  console.log("✅ STRIPE EVENT:", event.type);
  console.log("=================================");

  // ==========================================
  // CHECKOUT COMPLETED
  // ==========================================

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("💰 CHECKOUT TAMAMLANDI");
    console.log("Session ID:", session.id);
    console.log("Customer email:", session.customer_email);
    console.log("Payment status:", session.payment_status);

    // ==========================================
    // PAYMENT CHECK
    // ==========================================

    if (session.payment_status !== "paid") {
      console.log("⚠️ Ödeme paid değil.");

      return res.json({
        received: true,
      });
    }

    console.log(
      "✅ ÖDEME STRIPE TARAFINDAN ONAYLANDI"
    );

    // ==========================================
    // CUSTOMER
    // ==========================================

    const customerEmail =
      session.customer_email ||
      session.customer_details?.email ||
      session.metadata?.email ||
      "";

    const customerName =
      session.customer_details?.name ||
      `${session.metadata?.firstName || ""} ${
        session.metadata?.lastName || ""
      }`.trim() ||
      "Client";

    const amount = (
      (session.amount_total || 0) / 100
    ).toFixed(2);

    const currency =
      session.currency?.toUpperCase() || "EUR";

    const paymentType =
      session.metadata?.type || "order";

    const plan =
      session.metadata?.plan === "annuel"
        ? "Abonnement annuel Atlasia Kids"
        : session.metadata?.plan || "";

    console.log("👤 Client:", customerName);
    console.log("📧 Client email:", customerEmail);
    console.log("💰 Montant:", amount, currency);

    // ==========================================
    // MONGODB - ÖDEMEYİ KAYDET
    // ==========================================

    try {
      const existingOrder = await Order.findOne({
        stripeSessionId: session.id,
      });

      if (existingOrder) {
        console.log(
          "⚠️ Bu Stripe session zaten MongoDB'de kayıtlı:",
          session.id
        );
      } else {
        const newOrder = await Order.create({
          stripeSessionId: session.id,

          customer: {
            email: customerEmail,

            firstName:
              session.metadata?.firstName ||
              customerName.split(" ")[0] ||
              "Client",

            lastName:
              session.metadata?.lastName ||
              customerName.split(" ").slice(1).join(" ") ||
              "Client",

            address:
              session.metadata?.address ||
              session.customer_details?.address?.line1 ||
              "Non renseignée",

            postalCode:
              session.metadata?.postalCode ||
              session.customer_details?.address?.postal_code ||
              "00000",

            city:
              session.metadata?.city ||
              session.customer_details?.address?.city ||
              "Non renseignée",

            country:
              session.metadata?.country ||
              session.customer_details?.address?.country ||
              "France",
          },

          items: [],

          subtotal: Number(amount),

          total: Number(amount),

          paymentMethod: "card",

          status: "paid",
        });

        console.log("=================================");
        console.log("✅ ÖDEME MONGODB'YE KAYDEDİLDİ");
        console.log("MongoDB Order ID:", newOrder._id);
        console.log("Stripe Session ID:", session.id);
        console.log("Status:", newOrder.status);
        console.log("Total:", newOrder.total);
        console.log("=================================");
      }
    } catch (dbError) {
      console.error(
        "❌ MONGODB ÖDEME KAYIT HATASI:",
        dbError.message
      );
    }

    // ==========================================
    // EMAIL
    // ==========================================

    if (!resend) {
      console.log(
        "⚠️ RESEND_API_KEY bulunamadı. Email gönderilmedi."
      );
    } else {
      const fromEmail =
        process.env.EMAIL_FROM ||
      "contact@atlasiakids.fr";

      // ==========================================
      // ATLASIA EMAIL
      // ==========================================

      console.log("📨 Atlasia email gönderiliyor...");

      try {
        const { data, error } =
          await resend.emails.send({
            from: `Atlasia Kids <${fromEmail}>`,

            to: [process.env.EMAIL_USER],

            subject:
              "💰 Nouveau paiement Atlasia Kids",

            text: `
NOUVEAU PAIEMENT REÇU

=====================

Client :
${customerName}

Email :
${customerEmail || "Non renseigné"}

Montant :
${amount} ${currency}

Type :
${paymentType}

Plan :
${plan || "Produit"}

Paiement :
Stripe - paiement unique

Session Stripe :
${session.id}

=====================

Paiement confirmé par Stripe.
            `,
          });

        if (error) {
          throw new Error(error.message);
        }

        console.log("✅ EMAIL ATLASIA ENVOYÉ");
        console.log("📨 Resend ID:", data?.id);
      } catch (err) {
        console.error(
          "❌ ERREUR EMAIL ATLASIA:",
          err.message
        );
      }

      // ==========================================
      // CLIENT EMAIL
      // ==========================================

      if (customerEmail) {
        console.log(
          "📨 Email client gönderiliyor..."
        );

        try {
          const { data, error } =
            await resend.emails.send({
              from: `Atlasia Kids <${fromEmail}>`,

              to: [customerEmail],

              subject:
                "✅ Confirmation de votre paiement - Atlasia Kids",

              text: `
Bonjour ${customerName},

Nous vous confirmons que votre paiement a bien été reçu.

Montant payé :

${amount} ${currency}

${
  plan
    ? `Plan :

${plan}

`
    : ""
}

Paiement :

Paiement unique par carte via Stripe.

Votre paiement a été confirmé avec succès.

Merci pour votre confiance.

L'équipe Atlasia Kids
              `,
            });

          if (error) {
            throw new Error(error.message);
          }

          console.log(
            "✅ EMAIL CLIENT ENVOYÉ:",
            customerEmail
          );

          console.log(
            "📨 Resend ID:",
            data?.id
          );
        } catch (err) {
          console.error(
            "❌ ERREUR EMAIL CLIENT:",
            err.message
          );
        }
      } else {
        console.log(
          "⚠️ AUCUN EMAIL CLIENT"
        );
      }
    }
  }

  return res.json({
    received: true,
  });
});

export default router;

