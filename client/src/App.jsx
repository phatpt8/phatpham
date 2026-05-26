import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { useThemeStore } from './store/theme';
import Layout from './components/Layout';
import MePage from './pages/Me';
import BlogPage from './pages/Blog';
import PostPage from './pages/Post';
import EditorPage from './pages/Editor';
import LoginPage from './pages/Login';

export default function App() {
  const initAuth = useAuthStore((s) => s.init);
  const initTheme = useThemeStore((s) => s.init);

  useEffect(() => {
    initAuth();
    initTheme();
  }, [initAuth, initTheme]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/me" replace />} />
        <Route path="/me" element={<MePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
