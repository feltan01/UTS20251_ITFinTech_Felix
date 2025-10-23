import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, password } = req.body || {};

    // Validasi input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    const normEmail = String(email).toLowerCase().trim();

    await dbConnect();

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email: normEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Simpan user baru via Mongoose
    const user = new User({
      name: String(name).trim(),
      email: normEmail,
      phone: String(phone).trim(),
      password: hashedPassword,
      role: 'user'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      userId: user._id
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}