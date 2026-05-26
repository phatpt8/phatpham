import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, BookOpen, PenTool, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';
import { cn } from '../lib/utils';

const links = [
  { to: '/me', label: 'Me', icon: User },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/editor', label: 'Editor', icon: PenTool, auth: true },
];

export default function Nav() {
  const { user, logout } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="transition-transform group-hover:rotate-12">
            <rect x="2" y="2" width="28" height="28" rx="6" className="fill-primary/10 stroke-primary" strokeWidth="1.5" />
            <path d="M8 22V10l4 3v6l-4 3z" className="fill-primary" />
            <path d="M14 22V10l4 3v6l-4 3z" className="fill-accent" />
            <rect x="20" y="10" width="4" height="4" rx="1" className="fill-primary" />
            <rect x="20" y="16" width="4" height="6" rx="1" className="fill-primary/60" />
          </svg>
          <span className="text-lg font-bold tracking-tight gradient-text font-mono">
            pp_
          </span>
        </NavLink>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {links.map(({ to, label, icon: Icon, auth }) => {
            if (auth && !user) return null;
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative px-2.5 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    'hover:text-foreground',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Icon size={16} />
                      <span className="hidden sm:inline">{label}</span>
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <button
            onClick={toggleTheme}
            className="ml-1 sm:ml-2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.div>
          </button>

          {user && (
            <button
              onClick={logout}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
