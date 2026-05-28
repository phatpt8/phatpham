const postFiles = import.meta.glob('./posts/*.md', { eager: true, query: '?raw', import: 'default' });

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const frontmatter = match[1];
  const content = match[2].trim();
  const meta = {};

  for (const line of frontmatter.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim());
    }
    meta[key] = value;
  }

  return { meta, content };
}

function slugFromPath(path) {
  return path.replace('./posts/', '').replace('.md', '');
}

export function getAllPosts() {
  const posts = Object.entries(postFiles).map(([path, raw]) => {
    const { meta, content } = parseFrontmatter(raw);
    const slug = slugFromPath(path);
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '2026-01-01',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      cover: meta.cover || null,
      excerpt: meta.excerpt || content.slice(0, 160),
      content,
      readTime,
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug) || null;
}
