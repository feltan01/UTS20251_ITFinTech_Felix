import dbConnect from '../../lib/mongodb';
import Checkout from '../../models/Checkout';
import Product from '../../models/Product';

export default async function handler(req,res) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();
  const { items } = req.body; // [{ productId, quantity }]
  if (!items || !items.length) return res.status(400).json({ error: 'items required' });

  let total = 0;
  const built = [];
  for (const it of items) {
    const p = await Product.findById(it.productId);
    if (!p) return res.status(400).json({ error: `product not found ${it.productId}` });
    built.push({ product: p._id, quantity: it.quantity, price: p.price });
    total += p.price * it.quantity;
  }
  const checkout = await Checkout.create({ items: built, total, status: 'pending' });
  return res.status(201).json(checkout);
}
