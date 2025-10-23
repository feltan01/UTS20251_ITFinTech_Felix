import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import axios from 'axios';

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const normEmail = String(email).toLowerCase().trim();
    const normPassword = String(password).trim();

    // Connect ke MongoDB
    await dbConnect();

    // Cari user
    const user = await User.findOne({ email: normEmail });
    if (!user) {
      console.warn('Login failed: user not found for email', normEmail);
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(normPassword, user.password);
    if (!isMatch) {
      console.warn('Login failed: password mismatch for', normEmail);
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Generate MFA code & expiry (5 menit)
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.mfaCode = code;
    user.mfaExpiresAt = expiresAt;
    await user.save();

    // Kirim MFA via WhatsApp (Fonnte)
    if (FONNTE_TOKEN && user.phone) {
      try {
        const message = `🔐 Kode verifikasi login Anda: *${code}*\nKode ini berlaku 5 menit.`;
        await axios.post(
          'https://api.fonnte.com/send',
          {
            target: user.phone,
            message,
            countryCode: '62'
          },
          {
            headers: { Authorization: FONNTE_TOKEN }
          }
        );
      } catch (sendErr) {
        console.error('Failed to send MFA via Fonnte:', sendErr?.response?.data || sendErr.message);
      }
    } else {
      if (!FONNTE_TOKEN) console.warn('FONNTE_TOKEN is not set.');
      if (!user.phone) console.warn('User phone is missing.');
    }

    // Kirim response ke frontend (user object)
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user'
    };

    return res.status(200).json({
      message: 'Password benar, MFA code dikirim',
      mfaRequired: true,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan, coba lagi' });
  }
}
