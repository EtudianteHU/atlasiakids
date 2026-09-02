import { Router } from "express";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

const router = Router();

router.post("/", async (req, res, next) => {
  console.log("CONTACT ROUTE UPDATED");

  try {
    const { nom, email, telephone, sujet, message } = req.body;

    if (!nom || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Nom, email et message requis",
      });
    }

    let savedToDb = false;
    let emailSent = false;

    try {
      await Contact.create({ nom, email, telephone, sujet, message });
      savedToDb = true;
      console.log("Message enregistré en base ✅");
    } catch (dbErr) {
      console.warn("DB write failed (contact):", dbErr.message);
    }

    try {
      console.log("EMAIL_PASS exists?", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL);
      const info = await transporter.sendMail({
        from: `"Atlasia Kids" <${process.env.EMAIL_USER}>`,
        replyTo: email,
      to: process.env.CONTACT_EMAIL,
        subject: sujet || "Message du site Atlasia",
        html: `
          <h2>Nouveau message depuis le formulaire de contact</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Téléphone :</strong> ${telephone || "Non renseigné"}</p>
          <p><strong>Sujet :</strong> ${sujet || "Aucun sujet"}</p>
          <p><strong>Message :</strong></p>
          <p>${message}</p>
        `,
      });

      console.log("Email envoyé :", info.response);
      emailSent = true;
    } catch (emailErr) {
  console.error("EMAIL ERROR MESSAGE:", emailErr.message);
  console.error("EMAIL ERROR CODE:", emailErr.code);
  console.error("EMAIL ERROR RESPONSE:", emailErr.response);
    }

    if (savedToDb && emailSent) {
      return res.status(200).json({
        success: true,
        message: "Message envoyé ✅",
      });
    }

    if (savedToDb && !emailSent) {
      return res.status(207).json({
        success: false,
        message: "Message enregistré, mais email non envoyé.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Le message n'a pas pu être traité.",
    });
  } catch (err) {
    console.error("Erreur route contact :", err);
    next(err);
  }
});

export default router;