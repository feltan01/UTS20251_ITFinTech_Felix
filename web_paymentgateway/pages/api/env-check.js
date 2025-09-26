export default function handler(req, res) {
  res.status(200).json({
    MONGODB_URI: process.env.MONGODB_URI || null,
    XENDIT_SECRET_KEY: process.env.XENDIT_SECRET_KEY || null,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || null
  });
}
