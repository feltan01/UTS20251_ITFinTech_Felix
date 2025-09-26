import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number,
});

const CheckoutSchema = new mongoose.Schema({
  items: [ItemSchema],
  total: Number,
  status: { type: String, enum: ['pending','paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Checkout || mongoose.model('Checkout', CheckoutSchema);
