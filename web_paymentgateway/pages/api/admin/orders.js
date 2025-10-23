import dbConnect from "../../../lib/mongodb";
import Checkout from "../../../models/Checkout";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const orders = await Checkout.find({}).sort({ createdAt: -1 }).lean();

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderId: order.external_id || order._id.toString().slice(-8),
      customerName: order.email?.split("@")[0] || "Guest",
      customerEmail: order.email || "N/A",
      items: order.items || [],
      amount: order.total || 0,
      status: (order.status || "PENDING").toUpperCase(),
      paymentMethod: order.payment_method || "N/A",
      paymentUrl: order.invoice_url || null,
      paidAt: order.paid_at || null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      orders: formattedOrders,
      total: formattedOrders.length,
    });
  } catch (error) {
    console.error("❌ Get orders error:", error);
    return res.status(500).json({ error: error.message });
  }
}
