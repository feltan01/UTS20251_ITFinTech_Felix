import { Xendit } from "xendit-node";

const x = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY, // pastikan sama dengan yang di createInvoice
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "invoice_id dibutuhkan" });

  try {
    const invoice = await x.Invoice.getInvoice({ invoiceID: id });
    res.status(200).json(invoice);
  } catch (err) {
    console.error("❌ Error getInvoice:", err.response?.data || err);
    res.status(500).json({ error: "Gagal mengambil invoice" });
  }
}
