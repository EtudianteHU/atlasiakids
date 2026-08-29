import mongoose from "mongoose";
import dotenv from "dotenv";
import Issue from "./models/Issue.js";

dotenv.config();

const issues = [
  {
    number: 1,
    title: "Mon Journal du Ramadan - Numéro du Janvier (N° 1)",
    price: 7.99,
    image: "/images/ramadan.jpg.jpeg",
    description: "Premier numéro spécial Ramadan",
    isSoldOut: false,
    stock: 50,
  },
  {
    number: 2,
    title: "Numéro de Février 2026 (N° 2)",
    price: 7.99,
    image: "/images/page-de-garde-1.png",
    description: "Édition Février 2026",
    isSoldOut: false,
    stock: 50,
  },
  {
    number: 3,
    title: "Numéro de Mars 2026 (N° 3)",
    price: 7.99,
    image: "/images/page-de-garde-2.png",
    description: "Édition Mars 2026",
    isSoldOut: false,
    stock: 50,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connecté ✅");

    // Try to insert (skip existing)
    for (const issue of issues) {
      try {
        await Issue.findOneAndUpdate(
          { number: issue.number },
          issue,
          { upsert: true, new: true }
        );
        console.log(`Issue #${issue.number} ✅`);
      } catch (err) {
        console.warn(`Issue #${issue.number} skipped:`, err.message);
      }
    }

    console.log("Seed terminé !");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seed erreur:", err.message);
    process.exit(1);
  }
}

seed();
