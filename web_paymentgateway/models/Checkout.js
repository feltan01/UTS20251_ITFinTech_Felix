import mongoose from "mongoose";

const CheckoutSchema = new mongoose.Schema({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "PENDING" },
  email: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Checkout || mongoose.model("Checkout", CheckoutSchema);
