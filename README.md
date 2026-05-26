# phatpham

Personal blog and portfolio site for Phat Pham.

## Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend**: Express 5, better-sqlite3, JWT auth
- **State**: Zustand (client), static markdown (blog content)
- **Editor**: @uiw/react-md-editor with live preview

## Quick Start

```bash
npm install
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3002

## Routes

| Path | Description |
|------|-------------|
| `/#/me` | Resume / portfolio |
| `/#/blog` | Published posts |
| `/#/blog/:slug` | Single post view |
| `/#/editor` | Create new post (auth required) |
| `/#/login` | Authentication |

## Auth

Pre-seeded admin account. No registration endpoint.

## Deployment

Static frontend deployed to GitHub Pages via `gh-pages` branch. Blog posts are bundled as static markdown files.

## Project Structure

```
blog/
├── client/           # React SPA (HashRouter)
│   ├── public/       # Static assets (CV, graffiti logo)
│   └── src/
│       ├── components/
│       ├── content/  # Markdown blog posts
│       ├── pages/
│       └── store/
├── server/           # Express API
│   └── src/
│       ├── routes/
│       ├── db.js
│       └── auth.js
└── package.json      # Workspace root
```
