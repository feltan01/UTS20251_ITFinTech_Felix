import dbConnect from '../../lib/mongodb';
import Product from '../../models/Product';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const products = await Product.find({});
    return res.status(200).json(products);
  }
  if (req.method === 'POST') {
    const { name, price, category, stock, image } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'name & price required' });
    const prod = await Product.create({ name, price, category, stock, image });
    return res.status(201).json(prod);
  }
  res.status(405).end();
}
