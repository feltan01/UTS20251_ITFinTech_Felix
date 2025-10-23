import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }

    console.log("Looking for invoice with external_id:", id);

    // Cari berdasarkan external_id (bukan _id MongoDB)
    const checkout = await Checkout.findOne({ external_id: id });
    
    if (!checkout) {
      console.log("Invoice not found:", id);
      return res.status(404).json({ error: "Invoice not found" });
    }

    console.log("Found checkout:", checkout);

    // Return data yang dibutuhkan frontend
    const invoiceData = {
      external_id: checkout.external_id,
      amount: checkout.amount || 0,
      status: checkout.status,
      payment_method: checkout.payment_method || "Unknown",
      paid_at: checkout.paid_at,
      created_at: checkout.createdAt || checkout.created_at,
      user_id: checkout.user_id
    };

    res.status(200).json(invoiceData);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}