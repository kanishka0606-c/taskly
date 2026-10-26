import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Put this in front of any route that needs a logged-in user
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in' });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: 'Please log in' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Please log in' });
  }
}