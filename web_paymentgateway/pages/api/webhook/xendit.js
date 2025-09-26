import dbConnect from '../../../lib/mongodb';
import Payment from '../../../models/Payment';
import Checkout from '../../../models/Checkout';

export default async function handler(req,res) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();

  // simple header check. For production, verify HMAC signature of raw body
  const sig = req.headers['x-xendit-signature'] || req.headers['x-signature'] || req.headers['signature'];
  if (process.env.XENDIT_WEBHOOK_SECRET) {
    if (!sig || sig !== process.env.XENDIT_WEBHOOK_SECRET) {
      console.warn('Invalid webhook signature', sig);
      return res.status(401).json({ ok:false, message:'invalid signature' });
    }
  }

  const event = req.body;
  const xenditInvoiceId = event.id || event.data?.id;
  const external_id = event.external_id || event.data?.external_id;
  const status = (event.status || event.data?.status || '').toLowerCase();

  const payment = await Payment.findOne({ $or: [{ xenditInvoiceId }, { external_id }] });
  if (payment) {
    payment.status = status.toUpperCase();
    await payment.save();
    if (status === 'paid') {
      const checkout = await Checkout.findById(payment.checkout);
      if (checkout) {
        checkout.status = 'paid';
        await checkout.save();
      }
    }
  } else {
    console.warn('Payment not found for webhook', xenditInvoiceId, external_id);
  }
  return res.status(200).json({ ok:true });
}
