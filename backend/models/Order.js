import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  issueId: { type: String, required: true }, // 👈 CHANGÉ
  title: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  image: String,
});
const orderSchema = new mongoose.Schema(
  {   stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    customer: {
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      company: String,
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, default: "France" },
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "card"],
      default: "cash_on_delivery",
    },
  status: {
  type: String,
  enum: ["pending", "paid", "confirmed", "shipped", "delivered", "cancelled"],
  default: "pending",
}
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
