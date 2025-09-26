import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  stock: { type: Number, default: 9999 },
  image: { type: String, default: '' },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
