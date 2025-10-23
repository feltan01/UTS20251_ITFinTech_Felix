import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";
import { v4 as uuidv4 } from "uuid";

const XENDIT_API_KEY = process.env.XENDIT_SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim();

export default async function handler(req, res) {
  await dbConnect();

  // === [POST] BUAT CHECKOUT BARU ===
  if (req.method === "POST") {
    try {
      const { items, email } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Cart kosong" });
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * (item.qty || 1),
        0
      );

      // ✅ Gunakan UUID untuk external_id
      const external_id = `order-${uuidv4()}`;

      // Simpan ke database terlebih dahulu
      const checkout = await Checkout.create({
        email,
        items,
        total,
        external_id,
        status: "PENDING",
      });

      // Kalau Xendit belum dikonfigurasi, langsung return saja
      if (!XENDIT_API_KEY || !BASE_URL) {
        console.warn("⚠️ Xendit tidak dikonfigurasi — invoice dilewati");
        return res.status(201).json({
          success: true,
          checkout,
        });
      }

      // === BUAT INVOICE DI XENDIT ===
      const xenditPayload = {
        external_id,
        amount: total,
        payer_email: email || "test@example.com",
        description: `Pembayaran untuk pesanan ${external_id}`,
        invoice_duration: 86400, // 24 jam
        success_redirect_url: `${BASE_URL}/payment-success?order_id=${checkout._id}`,
        failure_redirect_url: `${BASE_URL}/payment-failed`,
        currency: "IDR",
        items: items.map((item) => ({
          name: item.name,
          quantity: item.qty || 1,
          price: item.price,
          category: "product",
        })),
      };

      console.log("📤 Mengirim payload ke Xendit:", xenditPayload);

      const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(XENDIT_API_KEY + ":").toString(
            "base64"
          )}`,
        },
        body: JSON.stringify(xenditPayload),
      });

      const xenditData = await xenditResponse.json();

      if (!xenditResponse.ok) {
        console.error("❌ Gagal membuat invoice Xendit:", xenditData);
        return res.status(500).json({
          success: false,
          message: "Gagal membuat invoice di Xendit",
          error: xenditData,
        });
      }

      // Update checkout dengan data invoice Xendit
      checkout.xendit_invoice_id = xenditData.id;
      checkout.invoice_url = (xenditData.invoice_url || "").trim();
      await checkout.save();

      console.log("✅ Checkout dan invoice tersimpan:", checkout._id);

      return res.status(201).json({
        success: true,
        checkout,
      });
    } catch (err) {
      console.error("❌ Error di checkout:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // === [GET] CEK STATUS CHECKOUT ===
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Checkout ID dibutuhkan" });
    }

    try {
      const checkout = await Checkout.findById(id);
      if (!checkout) {
        return res.status(404).json({ error: "Checkout tidak ditemukan" });
      }
      return res.status(200).json(checkout);
    } catch (err) {
      console.error("❌ Get checkout error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // === DEFAULT ===
  return res.status(405).json({ error: "Method not allowed" });
}
