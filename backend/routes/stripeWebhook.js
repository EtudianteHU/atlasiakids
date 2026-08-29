
import { Router } from "express";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const router = Router();

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

// ==========================================
// GMAIL
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// STRIPE WEBHOOK
// ==========================================

router.post("/", async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  // ==========================================
  // STRIPE SIGNATURE DOĞRULAMA
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
  // ÖDEME BAŞARILI
  // ==========================================

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("💰 CHECKOUT TAMAMLANDI");
    console.log("Session ID:", session.id);
    console.log(
      "Customer email:",
      session.customer_email
    );
    console.log(
      "Payment status:",
      session.payment_status
    );

    // ==========================================
    // GERÇEKTEN ÖDENMİŞ Mİ?
    // ==========================================

    if (session.payment_status !== "paid") {
      console.log(
        "⚠️ Ödeme henüz paid değil."
      );

      return res.json({
        received: true,
      });
    }

    console.log(
      "✅ ÖDEME STRIPE TARAFINDAN ONAYLANDI"
    );

    // ==========================================
    // MÜŞTERİ BİLGİLERİ
    // ==========================================

    const customerEmail =
      session.customer_email ||
      session.customer_details?.email ||
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

    // ==========================================
    // 1️⃣ ATLASIA'YA EMAIL
    // ==========================================

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,

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

      console.log(
        "📧 Email envoyé à Atlasia"
      );
    } catch (err) {
      console.error(
        "❌ Erreur email Atlasia:",
        err.message
      );
    }

    // ==========================================
    // 2️⃣ EMAIL DE CONFIRMATION AU CLIENT
    // ==========================================

    if (customerEmail) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: customerEmail,

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
${plan}`
    : ""
}

Paiement :
Paiement unique par carte via Stripe.

Votre paiement a été confirmé avec succès.

Merci pour votre confiance.

L'équipe Atlasia Kids
          `,
        });

        console.log(
          "📧 Confirmation envoyée au client:",
          customerEmail
        );
      } catch (err) {
        console.error(
          "❌ Erreur email client:",
          err.message
        );
      }
    } else {
      console.log(
        "⚠️ Aucun email client disponible."
      );
    }
  }

  return res.json({
    received: true,
  });
});

export default router;

