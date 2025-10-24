import mongoose from 'mongoose';
import Product from '../../../../models/Product';

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

  const { id } = req.query;

  // Validasi MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID produk tidak valid' });
  }

  // UPDATE PRODUCT
  if (req.method === 'PUT') {
    try {
      const { name, price, description, imageUrl, stock } = req.body;
      
      if (!name || !price) {
        return res.status(400).json({ error: 'Nama dan harga wajib diisi' });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { 
          name, 
          price, 
          description,
          imageUrl: imageUrl || '',
          stock: stock || 0
        },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      res.status(200).json({ 
        success: true, 
        product: updatedProduct,
        message: 'Produk berhasil diupdate' 
      });
    } catch (err) {
      console.error('Update product error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan server: ' + err.message });
    }
  } 
  
  // DELETE PRODUCT
  else if (req.method === 'DELETE') {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Produk berhasil dihapus' 
      });
    } catch (err) {
      console.error('Delete product error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan server: ' + err.message });
    }
  } 
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}