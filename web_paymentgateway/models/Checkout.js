import mongoose from "mongoose";

const CheckoutSchema = new mongoose.Schema({
  external_id: { type: String, required: true },
  user_id: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "PENDING" },
  payment_method: { type: String },
  paid_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Checkout || mongoose.model("Checkout", CheckoutSchema);
