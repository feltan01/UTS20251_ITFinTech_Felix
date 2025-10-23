import dbConnect from "../../../lib/mongodb";
import Checkout from "../../../models/Checkout";
import Product from "../../../models/Product"; // kalau kamu punya model Product

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const orders = await Checkout.find({}).sort({ createdAt: -1 });
    const products = await Product.find({});

    console.log(`📊 Analytics: Found ${orders.length} orders`);

    const isPaid = (status) => status && status.toUpperCase() === "PAID";
    const isPending = (status) => status && status.toUpperCase() === "PENDING";

    const paidOrders = orders.filter(o => isPaid(o.status));
    const pendingOrders = orders.filter(o => isPending(o.status));

    const totalRevenue = paidOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const totalOrders = orders.length;
    const pendingPayments = pendingOrders.length;

    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = orders.filter(o => {
        if (!o.createdAt) return false;
        const orderDate = new Date(o.createdAt);
        return orderDate >= date && orderDate < nextDate;
      });

      const paidDayOrders = dayOrders.filter(o => isPaid(o.status));
      const revenue = paidDayOrders.reduce((acc, o) => acc + (o.total || 0), 0);

      dailyStats.push({
        date: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        fullDate: date.toISOString().split("T")[0],
        revenue,
        orders: dayOrders.length,
        paidOrders: paidDayOrders.length,
      });
    }

    const productSales = {};
    paidOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const key = item.name || "Unknown";
          if (!productSales[key]) {
            productSales[key] = { name: key, qty: 0, revenue: 0 };
          }
          productSales[key].qty += item.qty || 0;
          productSales[key].revenue += (item.price || 0) * (item.qty || 0);
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.status(200).json({
      totalRevenue,
      totalOrders,
      paidOrders: paidOrders.length,
      pendingPayments,
      dailyStats,
      topProducts,
      productsCount: products.length,
      conversionRate:
        totalOrders > 0
          ? ((paidOrders.length / totalOrders) * 100).toFixed(1) + "%"
          : "0%",
      averageOrderValue:
        paidOrders.length > 0
          ? Math.round(totalRevenue / paidOrders.length)
          : 0,
    });
  } catch (error) {
    console.error("❌ Analytics error:", error);
    res.status(500).json({ error: error.message });
  }
}
