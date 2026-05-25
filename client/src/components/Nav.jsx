import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, BookOpen, PenTool, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { cn } from '../lib/utils';

const links = [
  { to: '/me', label: 'Me', icon: User },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/editor', label: 'Editor', icon: PenTool, auth: true },
];

export default function Nav() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-lg font-semibold tracking-tight gradient-text">
          ppham
        </NavLink>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon, auth }) => {
            if (auth && !user) return null;
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    'hover:text-foreground',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Icon size={16} />
                      {label}
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

          {user && (
            <button
              onClick={logout}
              className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
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
