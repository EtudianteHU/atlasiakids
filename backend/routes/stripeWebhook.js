
import { Router } from "express";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================================
// GMAIL
// ==========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ==========================================
// GMAIL BAĞLANTI TESTİ
// ==========================================

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ GMAIL BAĞLANTI HATASI:", error.message);
  } else {
    console.log("✅ GMAIL SMTP BAĞLANTISI BAŞARILI");
  }
});

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

    console.log(
      "Customer email:",
      session.customer_email
    );

    console.log(
      "Payment status:",
      session.payment_status
    );

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
    // 1️⃣ ATLASIA EMAIL
    // ==========================================

    console.log("📨 Atlasia email gönderiliyor...");

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "💰 Nouveau paiement Atlasia Kids",
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

      console.log("✅ EMAIL ATLASIA ENVOYÉ");
      console.log("📨 Message ID:", info.messageId);

    } catch (err) {

      console.error(
        "❌ ERREUR EMAIL ATLASIA:",
        err.message
      );
    }

    // ==========================================
    // 2️⃣ CLIENT EMAIL
    // ==========================================

    if (customerEmail) {

      console.log(
        "📨 Email client gönderiliyor..."
      );

      try {

        const info = await transporter.sendMail({
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
          "✅ EMAIL CLIENT ENVOYÉ:",
          customerEmail
        );

        console.log(
          "📨 Message ID:",
          info.messageId
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

  return res.json({
    received: true,
  });
});

export default router;

