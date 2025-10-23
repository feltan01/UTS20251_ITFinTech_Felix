import jwt from "jsonwebtoken";

export async function getUserFromReq(req) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    // Tambahan debug
    console.log("🪶 Incoming token:", token ? "Ada" : "Kosong");
    console.log("🔐 JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user;
  } catch (err) {
    console.error("❌ JWT verify error:", err.message);
    return null;
  }
}
