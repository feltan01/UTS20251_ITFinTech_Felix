// import mongoose from 'mongoose';
// import Product from '../../../models/Product';

// const connectDB = async () => {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }
// };

// export default async function handler(req, res) {
//   await connectDB();

//   if (req.method === 'GET') {
//     try {
//       const products = await Product.find({});
//       res.status(200).json({ success: true, products });
//     } catch (err) {
//       console.error('Get products error:', err);
//       res.status(500).json({ error: 'Terjadi kesalahan server' });
//     }
//   } else if (req.method === 'POST') {
//     try {
//       const { name, price, description } = req.body;
//       if (!name || !price) {
//         return res.status(400).json({ error: 'Nama dan harga wajib diisi' });
//       }

//       const newProduct = await Product.create({ name, price, description });
//       res.status(201).json({ success: true, product: newProduct });
//     } catch (err) {
//       console.error('Add product error:', err);
//       res.status(500).json({ error: 'Terjadi kesalahan server' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }

import mongoose from 'mongoose';
import Product from '../../../models/Product';

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const products = await Product.find({});
      res.status(200).json({ success: true, products });
    } catch (err) {
      console.error('Get products error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, price, description, imageUrl } = req.body; // ✅ TAMBAHAN: Terima imageUrl
      
      if (!name || !price) {
        return res.status(400).json({ error: 'Nama dan harga wajib diisi' });
      }

      const newProduct = await Product.create({ 
        name, 
        price, 
        description,
        imageUrl: imageUrl || '' // ✅ TAMBAHAN: Simpan imageUrl
      });
      
      res.status(201).json({ success: true, product: newProduct });
    } catch (err) {
      console.error('Add product error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}