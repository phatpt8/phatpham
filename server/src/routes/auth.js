import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { generateToken } from '../auth.js';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'ppham-blog-secret-change-in-prod';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ token: generateToken(user), user: { id: user.id, username: user.username } });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.json({ user: null });

  try {
    const decoded = jwt.verify(header.slice(7), SECRET);
    res.json({ user: { id: decoded.id, username: decoded.username } });
  } catch {
    res.json({ user: null });
  }
});

export default router;
