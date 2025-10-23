import { Xendit } from "xendit-node";
import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";

const x = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { amount, description, email } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Amount tidak valid" });
  }

  try {
    await dbConnect();

    const payload = {
      externalId: "order-" + Date.now(),
      amount: Number(amount),
      description: description || "Pembayaran produk",
      payerEmail: email || "test@example.com",
      successRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/failed`,
    };

    const invoice = await x.Invoice.createInvoice({ data: payload });

    const checkout = await Checkout.create({
      email: invoice.payerEmail,
      total: invoice.amount,
      status: "PENDING",
      external_id: invoice.externalId,
      xendit_invoice_id: invoice.id,
      invoice_url: (invoice.invoiceUrl || "").trim(),
    });

    return res.status(200).json({
      success: true,
      invoiceUrl: invoice.invoiceUrl,
      checkoutId: checkout._id,
    });
  } catch (err) {
    console.error("❌ Error create invoice:", err.response?.data || err);
    res.status(500).json({
      error: "Gagal membuat invoice",
      detail: err.response?.data || err.message,
    });
  }
}
