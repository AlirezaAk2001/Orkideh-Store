// pages/api/auth/login.js
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی هستند' });
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'کاربر پیدا نشد' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'ایمیل شما هنوز تأیید نشده است' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'رمز عبور نادرست است' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'خطای داخلی سرور: کلید JWT تعریف نشده' });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, verificationCode, ...safeUser } = user.toObject();

    return res.status(200).json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'خطا در لاگین' });
  }
}