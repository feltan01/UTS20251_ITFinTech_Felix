import { Xendit } from "xendit-node";
import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { checkoutId, email } = req.body;
    
    if (!checkoutId || !email)
      return res.status(400).json({ error: "Checkout ID dan email dibutuhkan" });

    await dbConnect();
    
    const checkout = await Checkout.findById(checkoutId);
    if (!checkout)
      return res.status(404).json({ error: "Checkout tidak ditemukan" });

    if (!checkout.total || checkout.total <= 0)
      return res.status(400).json({ error: "Total checkout tidak valid" });

    // Create Xendit Invoice
    const x = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
    const { Invoice } = x;
    
    const externalID = `order-${checkoutId}-${Date.now()}`;
    
    const invoice = await Invoice.createInvoice({
      externalID: externalID,
      amount: checkout.total,
      payerEmail: email,
      description: "Payment for your order",
      successRedirectUrl: "http://localhost:3000/payment-success",
      failureRedirectUrl: "http://localhost:3000/payment-failed",
    });

    // ✅ PENTING: Simpan external_id dan payment_url ke checkout
    checkout.external_id = invoice.external_id;
    checkout.payment_url = invoice.invoice_url;
    checkout.email = email; // update email juga
    await checkout.save();

    console.log("✅ Invoice created & saved:", {
      checkout_id: checkout._id,
      external_id: invoice.external_id,
      invoice_url: invoice.invoice_url
    });

    return res.status(200).json({
      invoiceUrl: invoice.invoice_url,
      external_id: invoice.external_id,
      id: invoice.id,
      checkoutId: checkout._id
    });
  } catch (err) {
    console.error("❌ Payment API Error:", err);
    return res.status(500).json({ 
      error: "Gagal membuat invoice", 
      message: err.message 
    });
  }
}