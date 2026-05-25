import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

router.get('/', (req, res) => {
  const { cursor, limit = 10 } = req.query;
  const pageSize = Math.min(parseInt(limit), 50);

  let posts;
  if (cursor) {
    posts = db
      .prepare(
        `SELECT id, title, slug, excerpt, tags, created_at, updated_at
         FROM posts WHERE published = 1 AND id < ? ORDER BY id DESC LIMIT ?`
      )
      .all(parseInt(cursor), pageSize + 1);
  } else {
    posts = db
      .prepare(
        `SELECT id, title, slug, excerpt, tags, created_at, updated_at
         FROM posts WHERE published = 1 ORDER BY id DESC LIMIT ?`
      )
      .all(pageSize + 1);
  }

  const hasMore = posts.length > pageSize;
  if (hasMore) posts.pop();

  const nextCursor = hasMore ? posts[posts.length - 1].id : null;

  res.json({
    posts: posts.map((p) => ({ ...p, tags: JSON.parse(p.tags) })),
    nextCursor,
  });
});

router.get('/:slug', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  res.json({ ...post, tags: JSON.parse(post.tags) });
});

router.post('/', authMiddleware, (req, res) => {
  const { title, content, excerpt, tags = [], published = false } = req.body;
  const slug = slugify(title) + '-' + Date.now().toString(36);

  const result = db
    .prepare(
      `INSERT INTO posts (title, slug, content, excerpt, tags, published)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(title, slug, content, excerpt || content.slice(0, 200), JSON.stringify(tags), published ? 1 : 0);

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...post, tags: JSON.parse(post.tags) });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { title, content, excerpt, tags, published } = req.body;
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  db.prepare(
    `UPDATE posts SET title = ?, content = ?, excerpt = ?, tags = ?, published = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    title ?? post.title,
    content ?? post.content,
    excerpt ?? post.excerpt,
    tags ? JSON.stringify(tags) : post.tags,
    published !== undefined ? (published ? 1 : 0) : post.published,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  res.json({ ...updated, tags: JSON.parse(updated.tags) });
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/drafts/all', authMiddleware, (req, res) => {
  const posts = db
    .prepare('SELECT id, title, slug, excerpt, tags, published, created_at, updated_at FROM posts ORDER BY id DESC')
    .all();

  res.json({ posts: posts.map((p) => ({ ...p, tags: JSON.parse(p.tags) })) });
});

export default router;
