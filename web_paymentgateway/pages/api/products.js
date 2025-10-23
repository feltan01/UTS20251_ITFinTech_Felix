import dbConnect from "../../lib/mongodb";
import Product from "../../models/Product"; // pastikan model Product sudah ada

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const products = await Product.find({}); // ambil semua products
      return res.status(200).json(products);
    } catch (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Gagal mengambil products", message: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
