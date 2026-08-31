import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";

import issueRoutes from "./routes/issues.js";
import orderRoutes from "./routes/orders.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import contactRoutes from "./routes/contact.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import userRoutes from "./routes/user.js";
import uploadRoute from "./routes/upload.js";
import stripeWebhookRouter from "./routes/stripeWebhook.js";

// Fix DNS (évite bugs Mongo / Stripe sur Windows)
dns.setDefaultResultOrder("ipv4first");

const app = express();

// --------------------
// CORS (IMPORTANT)
// --------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://atlasiakids.fr",
      "https://www.atlasiakids.fr",
      "https://atlasiakids.com",
      "https://www.atlasiakids.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --------------------
// STRIPE WEBHOOK (RAW BODY)
// ⚠️ DOIT ÊTRE AVANT express.json()
// --------------------
app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookRouter
);

// --------------------
// JSON BODY PARSER
// --------------------
app.use(express.json());

// --------------------
// ROUTES
// --------------------
app.get("/", (_req, res) => {
  res.send("Atlasia Kids API OK 🚀");
});

app.use("/api/issues", issueRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/upload", uploadRoute);

// --------------------
// UPLOAD TEST
// --------------------
app.get("/test-upload", (req, res) => {
  res.send("UPLOAD OK");
});

// --------------------
// ERROR HANDLER
// --------------------
app.use((err, _req, res, _next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Erreur serveur",
  });
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connecté");
    app.listen(PORT, () =>
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB erreur:", err.message);
    process.exit(1);
  });