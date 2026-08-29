import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, default: 7.99 },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    isSoldOut: { type: Boolean, default: false },
    stock: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
