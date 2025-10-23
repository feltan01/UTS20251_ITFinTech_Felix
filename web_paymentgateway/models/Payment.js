import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  checkoutId: String,
  amount: Number,
  status: { type: String, default: "PENDING" },
  referenceId: String,
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
