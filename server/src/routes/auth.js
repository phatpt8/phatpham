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

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  const existing = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existing) {
    return res.status(403).json({ error: 'Registration closed — single-user blog' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hash);

  const user = { id: result.lastInsertRowid, username };
  res.status(201).json({ token: generateToken(user), user });
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
