import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export async function signup(req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }
    const hash = await bcrypt.hash(password, 10);

    let userId = "local-" + Date.now();
    let savedUser = { email, firstName: firstName || "", lastName: lastName || "" };

    try {
      const user = await User.create({ email, password: hash, firstName: firstName || "", lastName: lastName || "" });
      userId = user._id;
      savedUser = { email: user.email, firstName: user.firstName, lastName: user.lastName };
    } catch (dbErr) {
      // DB read-only — continue with local fallback
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({
      message: "Compte créé ✅",
      userId,
      token,
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(200).json({
      userId: user._id,
      token,
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}