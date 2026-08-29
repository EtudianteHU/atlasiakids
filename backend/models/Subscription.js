import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "France" },
    plan: {
      type: String,
      enum: ["mensuel", "annuel"],
      default: "annuel",
    },  price: { type: Number},
  
     stripeSubscriptionId: { type: String }, // 🔥 IMPORTANT
   status: {
  type: String,
  enum: ["pending", "active", "cancelled", "expired"],
  default: "pending",
},
    startDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
