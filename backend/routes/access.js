import { Router } from "express";
import AccessCode from "../models/AccessCode.js";

const router = Router();

router.post("/verify", async (req, res) => {
  try {
    const code = String(req.body.code || "")
      .trim()
      .toUpperCase();

    if (!code) {
      return res.status(400).json({
        message: "Code manquant",
      });
    }

    const accessCode = await AccessCode.findOne({
      code,
      active: true,
    });

    if (!accessCode) {
      return res.status(401).json({
        message: "Code d'accès invalide",
      });
    }

    if (
      accessCode.expiresAt &&
      accessCode.expiresAt < new Date()
    ) {
      return res.status(401).json({
        message: "Ce code d'accès a expiré",
      });
    }

    return res.json({
      success: true,
      message: "Accès autorisé",
      email: accessCode.email,
      type: accessCode.type,
    });
  } catch (err) {
    console.error("ACCESS CODE ERROR:", err);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

export default router;