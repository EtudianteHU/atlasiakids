import { Router } from "express";
import Issue from "../models/Issue.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// GET all issues (avec pagination)
router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const issues = await Issue.find()
      .select("_id number title price image")
      .sort({ number: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(issues);
  } catch (err) {
    next(err);
  }
});

// GET one issue by number
router.get("/:number", async (req, res, next) => {
  try {
    const num = parseInt(req.params.number, 10);

    if (isNaN(num)) {
      return res.status(400).json({ message: "Numéro invalide" });
    }

    const issue = await Issue.findOne({ number: num })
    .select("_id number title price image")
      .lean();

    if (!issue) {
      return res.status(404).json({ message: "Numéro introuvable" });
    }

    res.json(issue);
  } catch (err) {
    next(err);
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const issue = await Issue.create({
   magazineId: req.body.magazineId,
  number: Number(req.body.number),
  title: req.body.title,
  price: Number(req.body.price),
  image: result.secure_url,
  description: req.body.description || "",
  isSoldOut: req.body.isSoldOut === "true",
  stock: Number(req.body.stock) || 50
    });

    res.json(issue);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;