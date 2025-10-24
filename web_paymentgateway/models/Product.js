// import mongoose from "mongoose";

// const ProductSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   description: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.Product || mongoose.model("Product", ProductSchema);

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' }, // ✅ TAMBAHAN: Field untuk URL gambar
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);