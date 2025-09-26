import dbConnect from '../../../lib/mongodb';
import Checkout from '../../../models/Checkout';

export default async function handler(req,res) {
  await dbConnect();
  const { id } = req.query;
  if (req.method === 'GET') {
    const checkout = await Checkout.findById(id).populate('items.product');
    if (!checkout) return res.status(404).json({ error: 'not found' });
    return res.status(200).json(checkout);
  }
  res.status(405).end();
}
