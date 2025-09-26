import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  try {
    const { external_id, user_id, amount, payment_method } = req.body;

    if (!external_id || !user_id || !amount)
      return res.status(400).json({ error: "Missing required fields" });

    const checkout = await Checkout.create({
      external_id,
      user_id,
      amount,
      status: "PENDING",
      payment_method,
    });

    console.log("Created checkout:", checkout);

    res.status(201).json({ message: "Checkout created", checkout });
  } catch (err) {
    console.error("CREATE CHECKOUT ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
  
}
