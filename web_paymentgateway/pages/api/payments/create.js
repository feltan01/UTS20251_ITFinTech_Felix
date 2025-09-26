import axios from 'axios';
import dbConnect from '../../../lib/mongodb';
import Checkout from '../../../models/Checkout';
import Payment from '../../../models/Payment';

export default async function handler(req,res) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();
  const { checkoutId, payerEmail } = req.body;
  const checkout = await Checkout.findById(checkoutId);
  if (!checkout) return res.status(404).json({ error: 'checkout not found' });
  const amount = checkout.total;
  const external_id = `utspay_${checkout._id}`;

  try {
    const resp = await axios.post('https://api.xendit.co/v2/invoices', {
      external_id,
      amount,
      payer_email: payerEmail || 'customer@example.com',
      description: `Pembayaran checkout ${checkout._id}`,
      success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment?checkoutId=${checkout._id}`
    }, {
      auth: { username: process.env.XENDIT_SECRET_KEY || '', password: '' }
    });

    const inv = resp.data;
    const payment = await Payment.create({
      checkout: checkout._id,
      xenditInvoiceId: inv.id,
      external_id: inv.external_id,
      status: inv.status,
      amount: inv.amount
    });

    return res.status(200).json({ invoice: inv, payment });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: err.response?.data || err.message });
  }
}
