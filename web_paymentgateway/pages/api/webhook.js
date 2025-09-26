import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";

export default async function handler(req, res) {
  await dbConnect();
  const event = req.body;
  if (event.status === "PAID") {
    await Checkout.findByIdAndUpdate(event.checkoutId, { status: "LUNAS" });
  }
  res.status(200).json({ received: true });
}
