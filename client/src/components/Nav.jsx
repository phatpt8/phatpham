import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, BookOpen, PenTool, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';

const STORAGE_KEY = 'nav-fab-position';
const SAFE_MARGIN = window.innerWidth < 640 ? 16 : 60;
const FAB_SIZE = 56;
const DEFAULT_POS = {
  x: window.innerWidth - FAB_SIZE - SAFE_MARGIN,
  y: SAFE_MARGIN,
};

function getSavedPosition() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
      const maxX = window.innerWidth - FAB_SIZE - SAFE_MARGIN;
      const maxY = window.innerHeight - FAB_SIZE - SAFE_MARGIN;
      const x = Math.max(SAFE_MARGIN, Math.min(saved.x, maxX));
      const y = Math.max(SAFE_MARGIN, Math.min(saved.y, maxY));
      return { x, y };
    }
  } catch {}
  return DEFAULT_POS;
}

function getFanDirection(pos) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = pos.x < cx ? 1 : -1;
  const dy = pos.y < cy ? 1 : -1;

  let startAngle;
  if (dx > 0 && dy > 0) startAngle = 0;
  else if (dx < 0 && dy > 0) startAngle = 90;
  else if (dx < 0 && dy < 0) startAngle = 180;
  else startAngle = 270;

  return startAngle;
}

const links = [
  { to: '/me', label: 'Me', icon: User },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/editor', label: 'Editor', icon: PenTool, auth: true },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(getSavedPosition);
  const dragRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);
  const posRef = useRef(pos);

  const { user, logout } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    const handleResize = () => {
      setPos((p) => {
        const maxX = window.innerWidth - FAB_SIZE - SAFE_MARGIN;
        const maxY = window.innerHeight - FAB_SIZE - SAFE_MARGIN;
        return {
          x: Math.max(SAFE_MARGIN, Math.min(p.x, maxX)),
          y: Math.max(SAFE_MARGIN, Math.min(p.y, maxY)),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = useCallback((e) => {
    movedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    const startPos = { x: posRef.current.x, y: posRef.current.y };
    const onMove = (ev) => {
      const dx = ev.clientX - dragStartRef.current.x;
      const dy = ev.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) movedRef.current = true;
      const maxX = window.innerWidth - FAB_SIZE - SAFE_MARGIN;
      const maxY = window.innerHeight - FAB_SIZE - SAFE_MARGIN;
      const nx = Math.max(SAFE_MARGIN, Math.min(startPos.x + dx, maxX));
      const ny = Math.max(SAFE_MARGIN, Math.min(startPos.y + dy, maxY));
      setPos({ x: nx, y: ny });
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posRef.current));
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, []);

  const handleClick = () => {
    if (!movedRef.current) setOpen(!open);
  };

  const visibleLinks = links.filter((l) => !l.auth || user);
  const allItems = [
    ...visibleLinks.map((l) => ({ ...l, type: 'link' })),
    { type: 'theme' },
    ...(user ? [{ type: 'logout' }] : []),
  ];

  const totalItems = allItems.length;
  const isMobileView = window.innerWidth < 640;
  const fanAngle = isMobileView ? 100 : 120;
  const startAngle = getFanDirection(pos);
  const radius = isMobileView ? 65 : 85;

  return (
    <>
      <motion.div
        className="fixed z-50"
        style={{ left: pos.x, top: pos.y, width: FAB_SIZE, height: FAB_SIZE }}
        animate={{ left: pos.x, top: pos.y }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      >
        {/* Fan menu items */}
        <AnimatePresence>
          {open &&
            allItems.map((item, i) => {
              const angle = startAngle + (fanAngle / Math.max(totalItems - 1, 1)) * i;
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <motion.div
                  key={item.to || item.type}
                  className="absolute"
                  style={{ left: FAB_SIZE / 2, top: FAB_SIZE / 2 }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: x - 22, y: y - 22, scale: 1, opacity: 1 }}
                  exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 600,
                    damping: 25,
                    delay: i * 0.02,
                  }}
                >
                  {item.type === 'link' && (
                    <NavLink
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm backdrop-blur-xl transition-colors ${
                          location.pathname === item.to
                            ? 'bg-primary/70 text-primary-foreground border border-white/20'
                            : 'bg-white/10 border border-white/15 text-foreground hover:bg-white/20'
                        }`}
                      >
                        <item.icon size={18} />
                      </div>
                      <span className="text-[10px] font-medium text-foreground whitespace-nowrap hidden sm:block">
                        {item.label}
                      </span>
                    </NavLink>
                  )}

                  {item.type === 'theme' && (
                    <button
                      onClick={() => { toggleTheme(); setOpen(false); }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 border border-white/15 text-foreground hover:bg-white/20 shadow-sm backdrop-blur-xl transition-colors">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                      </div>
                      <span className="text-[10px] font-medium text-foreground hidden sm:block">
                        {theme === 'dark' ? 'Light' : 'Dark'}
                      </span>
                    </button>
                  )}

                  {item.type === 'logout' && (
                    <button
                      onClick={() => { logout(); setOpen(false); }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 border border-white/15 text-destructive hover:bg-white/20 shadow-sm backdrop-blur-xl transition-colors">
                        <LogOut size={18} />
                      </div>
                      <span className="text-[10px] font-medium text-foreground hidden sm:block">
                        Logout
                      </span>
                    </button>
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Main floating button */}
        <motion.button
          onPointerDown={handlePointerDown}
          onClick={handleClick}
          className="relative w-14 h-14 rounded-full bg-primary/70 backdrop-blur-xl text-primary-foreground shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-white/10 flex items-center justify-center cursor-grab active:cursor-grabbing text-2xl select-none"
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: open ? 180 : 0, scale: open ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ touchAction: 'none' }}
        >
          {open ? '✕' : '🥦'}
        </motion.button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
