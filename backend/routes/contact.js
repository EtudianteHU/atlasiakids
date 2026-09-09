import { Router } from "express";
import { Resend } from "resend";
import Contact from "../models/Contact.js";

const router = Router();

// Connexion à Resend
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res, next) => {
  console.log("CONTACT ROUTE UPDATED");

  try {
    const { nom, email, telephone, sujet, message } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Nom, email et message requis",
      });
    }

    let savedToDb = false;
    let emailSent = false;

    // =========================
    // 1. ENREGISTREMENT MONGODB
    // =========================
    try {
      await Contact.create({
        nom,
        email,
        telephone,
        sujet,
        message,
      });

      savedToDb = true;
      console.log("Message enregistré en base ✅");
    } catch (dbErr) {
      console.warn(
        "DB write failed (contact):",
        dbErr.message
      );
    }

    // =========================
    // 2. ENVOI EMAIL AVEC RESEND
    // =========================
    try {
      console.log("📧 Envoi avec Resend...");
      console.log(
        "📧 CONTACT_EMAIL:",
        process.env.CONTACT_EMAIL
      );
      console.log(
        "📧 RESEND_API_KEY existe:",
        !!process.env.RESEND_API_KEY
      );

      const { data, error } = await resend.emails.send({
        from: "Atlasia Kids <contact@atlasiakids.fr>",
        to: [process.env.CONTACT_EMAIL],
        replyTo: email,
        subject: sujet || "Message du site Atlasia",

        html: `
          <h2>Nouveau message depuis le formulaire de contact</h2>

          <p>
            <strong>Nom :</strong>
            ${nom}
          </p>

          <p>
            <strong>Email :</strong>
            ${email}
          </p>

          <p>
            <strong>Téléphone :</strong>
            ${telephone || "Non renseigné"}
          </p>

          <p>
            <strong>Sujet :</strong>
            ${sujet || "Aucun sujet"}
          </p>

          <hr />

          <p>
            <strong>Message :</strong>
          </p>

          <p>
            ${message}
          </p>
        `,
      });

      if (error) {
        console.error("❌ RESEND ERROR:", error);
      } else {
        console.log(
          "✅ Email envoyé avec Resend:",
          data
        );

        emailSent = true;
      }
    } catch (emailErr) {
      console.error(
        "❌ EMAIL ERROR MESSAGE:",
        emailErr.message
      );
    }

    // =========================
    // 3. RÉPONSE AU FRONTEND
    // =========================

    if (savedToDb && emailSent) {
      return res.status(200).json({
        success: true,
        message: "Message envoyé ✅",
      });
    }

    if (savedToDb && !emailSent) {
      return res.status(207).json({
        success: false,
        message:
          "Message enregistré, mais email non envoyé.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Le message n'a pas pu être traité.",
    });
  } catch (err) {
    console.error(
      "Erreur route contact :",
      err
    );

    next(err);
  }
});

export default router;