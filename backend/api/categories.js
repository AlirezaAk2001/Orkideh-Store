// pages/api/categories.js
import connectDB from '../../lib/mongoose';
import Category from '../../models/Category'; // مدل دسته‌بندی رو بساز

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  try {
    const categories = await Category.find(); // یا از دیتای دستی
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'خطا در لود دسته‌بندی‌ها' });
  }
}