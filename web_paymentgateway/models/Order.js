import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    items: [
      {
        name: String,
        price: Number,
        qty: Number,
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "PAID", "CANCELLED"], default: "PENDING" },
    paymentId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "orders" }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
