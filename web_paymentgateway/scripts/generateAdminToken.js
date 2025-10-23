import jwt from "jsonwebtoken";
import "dotenv/config";

const token = jwt.sign(
  {
    user: {
      email: "admin3@gmail.com",
      role: "admin",
    },
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

console.log("✅ Admin JWT Token:\n", token);
