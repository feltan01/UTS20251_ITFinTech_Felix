import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { items, email } = req.body;
      if (!items || items.length === 0)
        return res.status(400).json({ error: "Cart kosong" });

      const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

      const checkout = await Checkout.create({
        items,
        total,
        status: "PENDING",
        email: email || "test@example.com",
      });

      return res.status(201).json(checkout);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Checkout ID dibutuhkan" });

    try {
      const checkout = await Checkout.findById(id);
      if (!checkout)
        return res.status(404).json({ error: "Checkout tidak ditemukan" });
      return res.status(200).json(checkout);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
