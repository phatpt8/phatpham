import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, MotionConfig } from 'motion/react';
import { MapPin, Mail, Briefcase, Code2, GraduationCap, Download, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useThemeStore } from '../store/theme';
import { identity, tagline, about, titles, scrambleChars, experience, earlier, skills, education } from '../data/profile';

const EMAIL = identity.email;
const LINKEDIN = identity.linkedin;

/* ----------------------------------------------------------------------------
 * Shared primitives
 * ------------------------------------------------------------------------- */

function CompanyLogo({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  const initial = alt?.charAt(0)?.toUpperCase() || '?';

  if (failed || !src) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-sm ${className}`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-lg bg-white/10 object-contain p-1 ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function LinkedinIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// HUD-style corner ticks layered onto a positioned container.
function CornerBrackets() {
  const b = 'absolute w-3 h-3 border-primary/40 group-hover:border-primary/70 transition-colors duration-300 pointer-events-none';
  return (
    <span aria-hidden="true">
      <span className={`${b} top-2 left-2 border-t border-l`} />
      <span className={`${b} top-2 right-2 border-t border-r`} />
      <span className={`${b} bottom-2 left-2 border-b border-l`} />
      <span className={`${b} bottom-2 right-2 border-b border-r`} />
    </span>
  );
}

// Translucent frosted-glass panel with corner ticks + hover glow.
function Panel({ children, className = '' }) {
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === 'light';
  return (
    <div
      className={`group relative rounded-2xl glow-hover transition-all duration-300 ${className}`}
      style={{
        background: isLight
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.30), rgba(236, 238, 255, 0.16))'
          : 'linear-gradient(180deg, rgba(26, 30, 58, 0.42), rgba(10, 12, 28, 0.30))',
        border: `1px solid ${isLight ? 'rgba(99, 102, 241, 0.20)' : 'rgba(160, 170, 255, 0.16)'}`,
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        boxShadow: isLight
          ? 'inset 0 1px 0 rgba(255, 255, 255, 0.6)'
          : 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      <CornerBrackets />
      {children}
    </div>
  );
}

function SectionHeader({ index, label, title, icon: Icon }) {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-xs text-primary tracking-[0.3em]">{index}</span>
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-muted-foreground">{label}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-primary/40 via-primary/15 to-transparent" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
      </div>
      {title && (
        <h2 className="flex items-center gap-2.5 text-2xl sm:text-3xl font-semibold tracking-tight">
          {Icon && <Icon size={22} className="text-primary" aria-hidden="true" />}
          {title}
        </h2>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Cosmic background: animated starfield + nebulae + vignette
 * ------------------------------------------------------------------------- */

function Starfield() {
  const theme = useThemeStore((s) => s.theme);
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let w = 0;
    let h = 0;
    let stars = [];
    let bright = [];

    const isLight = theme === 'light';
    const layers = [
      { density: 95, speed: 0.015, min: 0.5, max: 1.0, alpha: 0.6 },
      { density: 55, speed: 0.04, min: 0.7, max: 1.5, alpha: 0.85 },
      { density: 26, speed: 0.085, min: 1.0, max: 2.1, alpha: 1.0 },
    ];
    const rgb = isLight ? '79, 70, 229' : '226, 232, 255';
    const brightColors = isLight
      ? ['99, 102, 241', '79, 70, 229']
      : ['255, 255, 255', '165, 180, 252', '103, 232, 249'];

    function seed() {
      const area = (w * h) / 1_000_000;
      stars = [];
      for (const L of layers) {
        const n = Math.round(L.density * area);
        for (let i = 0; i < n; i++) {
          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: L.min + Math.random() * (L.max - L.min),
            a: L.alpha * (0.55 + Math.random() * 0.45),
            tw: Math.random() * Math.PI * 2,
            speed: L.speed,
          });
        }
      }
      bright = [];
      const nb = Math.round(8 * area);
      for (let i = 0; i < nb; i++) {
        bright.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.4 + Math.random() * 1.6,
          a: 0.85 + Math.random() * 0.15,
          tw: Math.random() * Math.PI * 2,
          speed: 0.05,
          color: brightColors[Math.floor(Math.random() * brightColors.length)],
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function render(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.shadowBlur = 0;
      for (const s of stars) {
        if (!prefersReducedMotion) {
          s.y += s.speed;
          if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
        }
        const twinkle = prefersReducedMotion ? 1 : 0.55 + 0.45 * Math.sin(t * 0.002 + s.tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${(s.a * twinkle).toFixed(3)})`;
        ctx.fill();
      }
      for (const s of bright) {
        if (!prefersReducedMotion) {
          s.y += s.speed;
          if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
        }
        const twinkle = prefersReducedMotion ? 1 : 0.5 + 0.5 * Math.sin(t * 0.0016 + s.tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${(s.a * twinkle).toFixed(3)})`;
        ctx.shadowBlur = 9;
        ctx.shadowColor = `rgba(${s.color}, 0.9)`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function loop(t) {
      render(t);
      if (!prefersReducedMotion && !document.hidden) raf = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!prefersReducedMotion) raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    if (prefersReducedMotion) render(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [theme, prefersReducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}

function CosmicBackground() {
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === 'light';
  const voidGradient = isLight
    ? 'radial-gradient(130% 120% at 68% 2%, #e9eaff 0%, #eef0fb 45%, #f6f5fb 75%, #fafafa 100%)'
    : 'radial-gradient(130% 120% at 68% 2%, #241a52 0%, #130d33 35%, #08060f 70%, #020108 100%)';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 transition-[background] duration-500" style={{ background: voidGradient }} />
      <div
        className="absolute -top-[18%] left-[42%] w-[70vw] h-[70vw] max-w-[820px] max-h-[820px] rounded-full blur-[90px] animate-[drift_22s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(circle, rgba(129,140,248,${isLight ? 0.3 : 0.55}), transparent 68%)` }}
      />
      <div
        className="absolute top-[6%] left-[8%] w-[50vw] h-[50vw] max-w-[620px] max-h-[620px] rounded-full blur-[90px] animate-[drift2_26s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(circle, rgba(167,139,250,${isLight ? 0.22 : 0.4}), transparent 70%)` }}
      />
      <div
        className="absolute bottom-[-12%] right-[-6%] w-[48vw] h-[48vw] max-w-[600px] max-h-[600px] rounded-full blur-[90px] animate-[drift_30s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(circle, rgba(34,211,238,${isLight ? 0.14 : 0.28}), transparent 70%)` }}
      />
      <Starfield />
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? 'radial-gradient(120% 100% at 50% 35%, transparent 55%, rgba(120,120,160,0.10) 100%)'
            : 'radial-gradient(120% 100% at 50% 35%, transparent 45%, rgba(2,1,8,0.6) 100%)',
        }}
      />
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Hero pieces
 * ------------------------------------------------------------------------- */

function FlipTitle() {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(titles[0]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      const interval = setInterval(() => {
        indexRef.current = (indexRef.current + 1) % titles.length;
        setDisplay(titles[indexRef.current]);
      }, 4000);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % titles.length;
      const target = titles[indexRef.current];
      const maxLen = Math.max(display.length, target.length);
      const delays = Array.from({ length: maxLen }, () => Math.random() * 800);
      const settled = new Array(maxLen).fill(false);
      const current = display.padEnd(maxLen, ' ').split('');

      const tick = setInterval(() => {
        const now = Date.now();
        let allDone = true;
        for (let i = 0; i < maxLen; i++) {
          if (settled[i]) continue;
          if (now - start > delays[i] + i * 50) {
            current[i] = target[i] || '';
            settled[i] = true;
          } else {
            current[i] = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            allDone = false;
          }
        }
        setDisplay(current.join('').trimEnd());
        if (allDone) clearInterval(tick);
      }, 70);
      const start = Date.now();
    }, 4000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="h-7 sm:h-9 flex items-center justify-center font-mono" aria-hidden="true">
      {display.split('').map((char, i) => (
        <span key={i} className="inline-block text-base sm:text-xl font-semibold text-primary tracking-wide transition-all duration-75">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

// Brand-style typographic wordmark (replaces the graffiti image) with a
// sweeping highlight + pulsing glow.
function BrandName() {
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === 'light';
  const gradient = isLight
    ? 'linear-gradient(100deg, #4f46e5 0%, #7c3aed 35%, #818cf8 50%, #0891b2 65%, #4f46e5 100%)'
    : 'linear-gradient(100deg, #6366f1 0%, #a5b4fc 35%, #ffffff 50%, #22d3ee 65%, #6366f1 100%)';
  return (
    <div className="brand-glow inline-block">
      <motion.h1
        className="brand-anim inline-block font-extrabold uppercase tracking-[-0.02em] whitespace-nowrap text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
        style={{
          backgroundImage: gradient,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {identity.name}
        <span className="sr-only">, {identity.role}</span>
      </motion.h1>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Motion helpers
 * ------------------------------------------------------------------------- */

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function Section({ children, className = '' }) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      {children}
    </motion.section>
  );
}

// Compact experience card that expands its "mission log" on click.
function ExperienceCard({ job, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const active = /present/i.test(job.period);
  const logId = `mission-log-${job.company.replace(/\W+/g, '-').toLowerCase()}`;

  return (
    <Panel className="overflow-hidden">
      <span
        className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full"
        style={{ background: job.accent, boxShadow: `0 0 14px ${job.accent}` }}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={logId}
        aria-label={`${open ? 'Collapse' : 'Expand'} mission log for ${job.title} at ${job.company}`}
        className="w-full text-left p-5 sm:p-6 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <CompanyLogo src={job.logo} alt={job.company} className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{job.title}</h3>
            <p className="text-xs sm:text-sm font-medium truncate" style={{ color: job.accent }}>
              {job.company} · {job.team}
            </p>
          </div>
          <ChevronDown
            size={18}
            className={`shrink-0 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180 text-primary' : ''}`}
            aria-hidden="true"
          />
        </div>

        <div className="mt-2.5 flex items-center gap-x-2 gap-y-1 flex-wrap font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          <span>{job.period}</span>
          <span aria-hidden="true">·</span>
          <span>{job.location}</span>
          <span aria-hidden="true" className="text-border">/</span>
          {active ? (
            <span className="inline-flex items-center gap-1 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              Active
            </span>
          ) : (
            <span className="text-muted-foreground/70">Archived</span>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={logId}
            key="log"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-primary/70">
                <span>{'// Mission Log'}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <ul className="space-y-2">
                {job.highlights.map((hl, j) => (
                  <li key={j} className="text-xs sm:text-sm text-muted-foreground flex gap-2.5">
                    <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full" style={{ background: job.accent }} aria-hidden="true" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function Me2Page() {
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : 120]);
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <CosmicBackground />

        {/* ===== HERO ===== */}
        <section
          ref={heroRef}
          aria-label="Introduction"
          className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
        >
          {/* orbital horizon */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 bottom-[-58%] w-[150vw] max-w-[1500px] aspect-square rounded-full border border-primary/15"
            style={{ boxShadow: '0 0 140px rgba(99,102,241,0.25), inset 0 1px 120px rgba(99,102,241,0.12)' }}
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 bottom-[-72%] w-[180vw] max-w-[1800px] aspect-square rounded-full border border-accent/10"
          />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative text-center max-w-3xl mx-auto w-full">
            <motion.div
              className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary/80 mb-6"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
              Berlin · 52.52°N · Systems Online
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3"
            >
              <BrandName />
              <FlipTitle />
            </motion.div>

            <motion.p
              className="text-base sm:text-lg md:text-xl font-light text-muted-foreground leading-relaxed max-w-2xl mx-auto mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              {tagline}
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-3 flex-wrap mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <a
                href={`${import.meta.env.BASE_URL}${identity.cvFile}`}
                download={identity.cvDownloadName}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.4)]"
                aria-label="Download CV as PDF"
              >
                <Download size={16} aria-hidden="true" />
                Download CV
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass text-foreground text-sm font-medium glow-hover transition-all"
              >
                <Mail size={16} aria-hidden="true" />
                Get in touch
              </a>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-xs text-muted-foreground mt-6 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <span className="flex items-center gap-1.5"><MapPin size={13} aria-hidden="true" /> Berlin, DE</span>
              <span className="text-border" aria-hidden="true">/</span>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail size={13} aria-hidden="true" /> {EMAIL}
              </a>
              <span className="text-border" aria-hidden="true">/</span>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors"
                aria-label="LinkedIn profile (opens in new tab)"
              >
                <LinkedinIcon size={13} /> LinkedIn
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            aria-hidden="true"
          >
            <div className="w-4 h-7 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-1.5">
              <div className="w-0.5 h-1.5 rounded-full bg-primary/40" />
            </div>
          </motion.div>
        </section>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-24 sm:space-y-32 pb-12">
          {/* ===== PROFILE ===== */}
          <Section>
            <SectionHeader index="00" label="Profile" />
            <motion.p variants={reveal} className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              {about}
            </motion.p>
          </Section>

          {/* ===== EXPERIENCE ===== */}
          <Section aria-label="Work experience">
            <SectionHeader index="01" label="Trajectory" title="Experience" icon={Briefcase} />
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent hidden sm:block" />
              <div className="space-y-5 sm:space-y-6">
                {experience.map((job, i) => (
                  <motion.div key={job.company} variants={reveal} className="relative sm:pl-10">
                    <span
                      className="absolute left-0 top-7 w-2.5 h-2.5 rounded-full border-2 border-background hidden sm:block"
                      style={{ backgroundColor: job.accent, boxShadow: `0 0 12px ${job.accent}` }}
                      aria-hidden="true"
                    />
                    <ExperienceCard job={job} defaultOpen={i === 0} />
                  </motion.div>
                ))}

                <motion.div variants={reveal} className="relative sm:pl-10">
                  <Panel className="p-5 sm:p-6">
                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Earlier</h3>
                    <div className="space-y-2.5">
                      {earlier.map((e) => (
                        <div key={e.company} className="flex items-center gap-3">
                          <CompanyLogo src={e.logo} alt={e.company} className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            <strong className="text-foreground">{e.role}, {e.company}</strong>. {e.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </motion.div>
              </div>
            </div>
          </Section>

          {/* ===== STACK ===== */}
          <Section aria-label="Technical stack">
            <SectionHeader index="02" label="Systems" title="Technical Stack" icon={Code2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(skills).map(([category, items]) => (
                <motion.div key={category} variants={reveal}>
                  <Panel className="p-5 h-full">
                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Panel>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* ===== EDUCATION ===== */}
          <Section aria-label="Education">
            <SectionHeader index="03" label="Origin" title="Education" icon={GraduationCap} />
            <motion.div variants={reveal}>
              <Panel className="p-6 text-center">
                <p className="font-medium text-lg">{education.degree}</p>
                <p className="text-muted-foreground mt-1 font-mono text-sm">{education.school} · {education.period}</p>
              </Panel>
            </motion.div>
          </Section>

          {/* ===== CONTACT ===== */}
          <Section aria-label="Contact">
            <SectionHeader index="04" label="Transmission" />
            <motion.div variants={reveal}>
              <Panel className="p-8 sm:p-12 text-center glow">
                <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">Let's build something</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mt-4">
                  Open to senior and lead engineering roles and high-impact collaborations.
                  The fastest way to reach me is email.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap mt-7">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.4)]"
                  >
                    <Mail size={16} aria-hidden="true" />
                    {EMAIL}
                  </a>
                  <a
                    href={LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass text-foreground text-sm font-medium glow-hover transition-all"
                    aria-label="LinkedIn profile (opens in new tab)"
                  >
                    <LinkedinIcon size={16} />
                    LinkedIn
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </Panel>
            </motion.div>
          </Section>
        </div>
      </div>
    </MotionConfig>
  );
}
