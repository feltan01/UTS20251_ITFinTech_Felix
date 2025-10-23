import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('payment_gateway');
    const ordersCollection = db.collection('orders');

    // Ambil semua orders, urutkan dari terbaru
    const orders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  } finally {
    await client.close();
  }
}