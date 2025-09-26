import { Xendit } from "xendit-node";

const x = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { amount, description, email } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Amount tidak valid" });
  }

  try {
    const payload = {
      externalId: "order-" + Date.now(),
      amount: Number(amount),
      description: description || "Pembayaran produk",
      payerEmail: email || "test@example.com",
      successRedirectUrl: "http://localhost:3000/payment-success",
      failureRedirectUrl: "http://localhost:3000/payment-failed",
    };

    console.log("Payload ke Xendit v7:", payload);

    // ❌ Jangan destructuring, cukup panggil langsung
    const invoice = await x.Invoice.createInvoice({ data: payload });

    console.log("Invoice created:", invoice);

    res.status(200).json({
      invoiceUrl: invoice.invoiceUrl, // ini yang frontend pakai
      externalId: invoice.externalId,
      id: invoice.id,
    });
  } catch (err) {
    console.error("❌ Error create invoice:", err.response?.data || err);
    res.status(500).json({ error: "Gagal membuat invoice", detail: err.response?.data || err.message });
  }
}
