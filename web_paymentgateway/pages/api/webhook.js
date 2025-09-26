import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  try {
    const event = req.body;
    console.log("Webhook event received:", event);

    const externalId = event.external_id;
    if (!externalId) return res.status(400).json({ error: "external_id not found" });

    if (event.status === "PAID") {
      // Cari berdasarkan string externalId, bukan findById
      const updated = await Checkout.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(externalId) }, // pastikan externalId valid ObjectId
        { status: "LUNAS" },
        { new: true }
      );

      if (!updated) {
        console.warn(`Checkout with id ${externalId} not found`);
      } else {
        console.log(`Checkout ${externalId} marked as LUNAS`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
