import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const payload = req.body.data || req.body;
    const { external_id, status } = payload;

    if (!external_id) return res.status(400).json({ message: "external_id tidak ditemukan" });

    const checkout = await Checkout.findOne({ external_id });
    if (!checkout) {
      return res.status(404).json({ message: "Checkout tidak ditemukan", external_id });
    }

    checkout.status = status || "PAID";
    await checkout.save();

    console.log(`✅ Checkout ${external_id} diupdate menjadi ${checkout.status}`);

    return res.status(200).json({ message: "Webhook processed", external_id, new_status: checkout.status });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
