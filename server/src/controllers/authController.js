import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function makeToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function userInfo(user) {
  return { id: user._id, name: user.name, email: user.email };
}

// POST /api/auth/register
export async function register(req, res) {
  const { name, email, password } = req.body || {};

  if ([name, email, password].some((v) => typeof v !== 'string' || !v.trim())) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const exists = await User.findOne({ email: cleanEmail });
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: cleanEmail, password: hashed });

  res.status(201).json({ token: makeToken(user), user: userInfo(user) });
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: makeToken(user), user: userInfo(user) });
}

// GET /api/auth/me
export function me(req, res) {
  res.json({ user: userInfo(req.user) });
}