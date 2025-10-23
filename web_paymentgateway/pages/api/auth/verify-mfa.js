// pages/api/auth/verify-mfa.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Verify MFA request body:', req.body);

    const { email, code } = req.body || {};

    if (!email || !code) {
      return res.status(400).json({ error: 'Email dan kode MFA wajib diisi' });
    }

    // Normalize email
    const normEmail = String(email).toLowerCase().trim();

    // Connect to MongoDB
    await dbConnect();
    console.log('MongoDB connected');

    // Find user by email
    const user = await User.findOne({ email: normEmail });
    if (!user) {
      console.warn('User not found for email:', normEmail);
      return res.status(400).json({ error: 'Email tidak ditemukan, login ulang' });
    }

    if (!user.mfaCode || !user.mfaExpiresAt) {
      console.warn('MFA not set for user:', normEmail);
      return res.status(400).json({ error: 'MFA tidak ditemukan, login ulang' });
    }

    const now = new Date();
    console.log('Current time:', now);
    console.log('MFA expiresAt:', user.mfaExpiresAt);

    // Check if MFA expired
    if (now > user.mfaExpiresAt) {
      console.warn('MFA expired for user:', normEmail);
      user.mfaCode = undefined;
      user.mfaExpiresAt = undefined;
      await user.save();
      return res.status(400).json({ error: 'Kode MFA sudah kadaluarsa, login ulang' });
    }

    // Check code match
    if (String(code).trim() !== user.mfaCode) {
      console.warn('MFA code mismatch for user:', normEmail, 'provided:', code, 'expected:', user.mfaCode);
      return res.status(400).json({ error: 'Kode MFA salah' });
    }

    // MFA verified -> clear code
    user.mfaCode = undefined;
    user.mfaExpiresAt = undefined;
    await user.save();
    console.log('MFA cleared for user:', normEmail);

    return res.status(200).json({ message: 'MFA verified', success: true });
  } catch (err) {
    console.error('Verify MFA error:', err);
    // Untuk debugging sementara, bisa tambahkan details
    return res.status(500).json({ 
      error: 'Terjadi kesalahan, coba lagi', 
      details: err.message 
    });
  }
}
