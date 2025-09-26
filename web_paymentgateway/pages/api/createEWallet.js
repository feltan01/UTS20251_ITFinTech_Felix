const { Xendit } = require("xendit-node");
const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { amount, channel, external_id } = req.body;
    if (!amount || !channel || isNaN(amount)) return res.status(400).json({ error: "Amount dan channel dibutuhkan" });

    const { EWallet } = xendit;
    const ewalletInstance = new EWallet();
    const charge = await ewalletInstance.createCharge({
      data: {
        referenceId: external_id || `ewallet-${Date.now()}`,
        currency: "IDR",
        amount: Number(amount),
        checkoutMethod: "ONE_TIME_PAYMENT",
        channelCode: channel,
        channelProperties: {
          successRedirectUrl: "http://localhost:3000/payment-success",
          failureRedirectUrl: "http://localhost:3000/payment-failed",
        }
      }
    });

    return res.status(200).json(charge);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gagal membuat e-wallet charge", message: err.message });
  }
}
