import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import Nav from './Nav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className="border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        <p>Built with curiosity and craft · Phat Pham © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
