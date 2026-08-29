import express from "express";
import { upload } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image envoyée" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    res.json({
      url: result.secure_url, // ✅ URL Cloudinary
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;