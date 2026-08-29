import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true },
    telephone: String,
    sujet: String,
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
