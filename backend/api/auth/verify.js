// pages/api/auth/verify.js
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'ایمیل و کد الزامی هستند' });
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'کاربر پیدا نشد' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'کد تأیید نادرست است' });
    }

    // محدودیت تلاش (اختیاری)
    if (user.verificationAttempts >= 5) {
      return res.status(429).json({ error: 'تعداد تلاش‌های ناموفق بیش از حد مجاز است' });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationAttempts = 0; // ریست تلاش‌ها
    await user.save();

    return res.status(200).json({ message: 'ایمیل شما تأیید شد' });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ error: 'خطا در تأیید' });
  }
}