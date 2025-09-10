// pages/api/auth/signup.js
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const allowedAdmins = ['alireza.akhoondi1@gmail.com'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, username, password } = req.body;
  if (!email || !password || !firstName || !lastName || !username) {
    return res.status(400).json({ error: 'تمام فیلدها اجباری هستند' });
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email ? 'کاربر از قبل وجود دارد' : 'نام کاربری از قبل وجود دارد',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const role = allowedAdmins.includes(email) ? 'admin' : 'user';

    const user = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      verificationCode,
      role,
    });

    await user.save();

    // ارسال ایمیل با مدیریت خطا
    try {
      await resend.emails.send({
        from: 'Shop <onboarding@resend.dev>',
        to: email,
        subject: 'کد تأیید حساب',
        html: `<p>کد تأیید شما: <b>${verificationCode}</b></p>`,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ error: 'ثبت‌نام موفق بود، اما ارسال ایمیل با خطا مواجه شد' });
    }

    return res.status(200).json({ message: 'ثبت‌نام موفق، ایمیل ارسال شد', uid: email });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'خطا در ثبت‌نام' });
  }
}