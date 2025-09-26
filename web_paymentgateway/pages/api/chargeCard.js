const { Xendit } = require("xendit-node");
const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { token_id, amount, description, external_id } = req.body;
    if (!token_id || !amount || isNaN(amount)) return res.status(400).json({ error: "Token ID dan amount dibutuhkan" });

    const { Card } = xendit;
    const cardInstance = new Card();
    const charge = await cardInstance.createCharge({
      data: {
        tokenId: token_id,
        amount: Number(amount),
        externalId: external_id || `charge-${Date.now()}`,
        description: description || "Card Payment",
      }
    });

    return res.status(200).json(charge);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gagal memproses kartu", message: err.message });
  }
}
