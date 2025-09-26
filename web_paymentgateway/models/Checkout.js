import mongoose from "mongoose";

const CheckoutSchema = new mongoose.Schema({
  items: [{ productId: String, name: String, price: Number, qty: Number }],
  total: Number,
  status: { type: String, default: "PENDING" },
});

export default mongoose.models.Checkout || mongoose.model("Checkout", CheckoutSchema);
