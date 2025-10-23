import mongoose from "mongoose";

const CheckoutSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    external_id: { type: String, required: true, unique: true },
    invoice_url: { type: String },
    payment_method: { type: String, default: "Xendit" },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "EXPIRED", "FAILED"],
      default: "PENDING",
    },
    paid_at: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Checkout ||
  mongoose.model("Checkout", CheckoutSchema);
