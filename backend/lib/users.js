// src/lib/users.js (جدید)
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const addUser = async ({ email, password, firstName, lastName, username }) => {
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    password: hashed,
    firstName,
    lastName,
    username,
    verified: false,
    verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
    role: 'user',
  });
  await newUser.save();
  return newUser;
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const verifyUserCode = async (email, code) => {
  const user = await findUserByEmail(email);
  if (!user || user.verificationCode !== code) return null;
  user.verified = true;
  user.verificationCode = null;
  await user.save();
  return user;
};

export const checkPassword = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  return match ? user : null;
};