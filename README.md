# ppham/blog

Personal blog site for Phat Pham — software engineer portfolio, blog posts, and markdown editor.

## Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, shadcn/ui, Motion
- **Backend**: Express 5, better-sqlite3, JWT auth
- **Data**: TanStack Query (server state), Zustand (auth state)
- **Editor**: @uiw/react-md-editor with live preview

## Quick Start

```bash
npm install
npm run dev
```

This starts both:
- Client at http://localhost:5173
- Server at http://localhost:3001

## First-time Setup

1. Start the app with `npm run dev`
2. Navigate to `/login`
3. The first user to register becomes the admin (registration closes after)
4. Go to `/editor` to write posts

## Routes

| Path | Description |
|------|-------------|
| `/me` | Resume / portfolio |
| `/blog` | Published posts (infinite scroll) |
| `/blog/:slug` | Single post view |
| `/editor` | Create new post (auth required) |
| `/editor/:id` | Edit existing post (auth required) |
| `/login` | Authentication |

## Project Structure

```
blog/
├── client/           # React SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       └── lib/
├── server/           # Express API
│   └── src/
│       ├── routes/
│       ├── db.js
│       └── auth.js
└── package.json      # Workspace root
```
