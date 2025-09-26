// scripts/seed.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });   // ⬅️ tambahkan ini

import dbConnect from "../lib/mongodb.js";
import Product from "../models/Product.js";

async function seed() {
  await dbConnect();

  await Product.deleteMany({});

  await Product.insertMany([
    { name: "iPhone 15", category: "Electronics", price: 20000000 },
    { name: "AirPods Pro", category: "Electronics", price: 3500000 },
    { name: "Nike Shoes", category: "Fashion", price: 1500000 },
    { name: "Macbook Pro", category: "Electronics", price: 30000000 },
  ]);

  console.log("✅ Products seeded");
  process.exit();
}

seed();
