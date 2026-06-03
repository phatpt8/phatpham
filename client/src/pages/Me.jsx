import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, MotionConfig } from 'motion/react';
import { MapPin, Mail, Briefcase, Code2, GraduationCap, Download } from 'lucide-react';
import { useThemeStore } from '../store/theme';
import {
  identity,
  about,
  titles,
  scrambleChars,
  quotes,
  experience,
  earlier,
  skills,
  education,
  hexToRgbTriplet,
} from '../data/profile';

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

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </div>
  );
}

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
    <div className="h-8 sm:h-10 md:h-12 flex items-center font-mono" aria-hidden="true">
      {display.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block text-lg sm:text-xl md:text-2xl font-semibold text-primary transition-all duration-75"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

function GraffitiName() {
  const theme = useThemeStore((s) => s.theme);
  const base = import.meta.env.BASE_URL;

  return (
    <div className="mb-3 sm:mb-4 select-none -mx-4 sm:-mx-8 relative" aria-hidden="true">
      <img
        src={`${base}phat-pham-graffiti-dark.png`}
        alt=""
        className="h-40 sm:h-56 md:h-72 w-auto object-contain transition-opacity duration-300"
        style={{
          opacity: theme === 'dark' ? 1 : 0,
          maskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 100%)',
        }}
        draggable={false}
      />
      <img
        src={`${base}phat-pham-graffiti-light.png`}
        alt=""
        className="absolute top-0 left-0 h-40 sm:h-56 md:h-72 w-auto object-contain transition-opacity duration-300"
        style={{
          opacity: theme === 'light' ? 1 : 0,
          maskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 100%)',
        }}
        draggable={false}
      />
    </div>
  );
}

function RotatingQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-4 min-h-[120px] flex flex-col items-center justify-center" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <figure>
            <blockquote className="text-2xl md:text-3xl font-light italic text-muted-foreground leading-relaxed">
              "{quotes[index].text}"
            </blockquote>
            <figcaption className="text-sm text-muted-foreground/70 mt-3">{quotes[index].author}</figcaption>
          </figure>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function ParallaxSection({ children, offset = 50, className = '' }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const eff = isMobile ? Math.round(offset * 0.3) : offset;
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [eff, -eff]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export default function MePage() {
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : 150]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <GridBackground />

        <section ref={heroRef} aria-label="Introduction" className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-0">
          <h1 className="sr-only">{identity.name}, {identity.role}</h1>
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="text-center space-y-6 sm:space-y-8 max-w-3xl mx-auto w-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <GraffitiName />
              <FlipTitle />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <RotatingQuote />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <MapPin size={14} aria-hidden="true" />
                {identity.location}
              </span>
              <span className="text-border hidden sm:inline" aria-hidden="true">•</span>
              <span className="flex items-center gap-1.5">
                <Mail size={14} aria-hidden="true" />
                {identity.email}
              </span>
              <span className="text-border hidden sm:inline" aria-hidden="true">•</span>
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors"
                aria-label="LinkedIn profile (opens in new tab)"
              >
                <LinkedinIcon size={14} />
                LinkedIn
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <a
                href={`${import.meta.env.BASE_URL}${identity.cvFile}`}
                download={identity.cvDownloadName}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                aria-label="Download CV as PDF"
              >
                <Download size={16} aria-hidden="true" />
                Download CV
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden sm:flex"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            aria-hidden="true"
          >
            <div className="w-4 h-7 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-1.5">
              <div className="w-0.5 h-1.5 rounded-full bg-primary/40" />
            </div>
          </motion.div>
        </section>

        {/* About */}
        <ParallaxSection offset={30}>
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
            <motion.p
              className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {about}
            </motion.p>
          </section>
        </ParallaxSection>

        <section aria-label="Work experience" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6 sm:space-y-8 relative">
          <ParallaxSection offset={20}>
            <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-semibold">
              <Briefcase size={20} className="text-primary" aria-hidden="true" />
              Experience
            </h2>
          </ParallaxSection>

          <div className="relative space-y-4 sm:space-y-6">
            {/* Timeline line (desktop only) */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden sm:block" />

            {experience.map((job, i) => {
              const rgb = hexToRgbTriplet(job.accent);
              const bg = `rgba(${rgb}, 0.08)`;
              const border = `rgba(${rgb}, 0.25)`;
              return (
                <motion.div
                  key={job.company}
                  className="rounded-xl p-4 sm:p-6 space-y-3 sm:ml-12 backdrop-blur-md transition-all duration-300"
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    boxShadow: `0 0 20px ${bg}, 0 0 60px ${bg}`,
                  }}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.01, boxShadow: `0 0 30px ${border}, 0 0 80px ${bg}` }}
                >
                  {/* Timeline dot (desktop only) */}
                  <div
                    className="absolute -left-[calc(3rem-5px)] top-8 w-2.5 h-2.5 rounded-full border-2 border-background hidden sm:block"
                    style={{ backgroundColor: job.accent }}
                    aria-hidden="true"
                  />

                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex items-start gap-3">
                      <CompanyLogo
                        src={job.logo}
                        alt={job.company}
                        className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">{job.title}</h3>
                        <p className="text-xs sm:text-sm" style={{ color: job.accent }}>
                          {job.company} · {job.team}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">
                          {job.period} · {job.location}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                        {job.period} · {job.location}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {job.highlights.map((h, j) => (
                      <li key={j} className="text-xs sm:text-sm text-muted-foreground flex gap-2">
                        <span className="mt-0.5 sm:mt-1 shrink-0" style={{ color: job.accent }} aria-hidden="true">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}

            {/* Earlier */}
            <motion.div
              className="glass rounded-xl p-4 sm:p-6 space-y-3 sm:ml-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-semibold text-foreground text-sm">Earlier</h3>
              {earlier.map((e) => (
                <div key={e.company} className="flex items-center gap-3">
                  <CompanyLogo src={e.logo} alt={e.company} className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>{e.role}, {e.company}</strong>. {e.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Technical Skills */}
        <ParallaxSection offset={25}>
          <section aria-label="Technical stack" className="max-w-4xl mx-auto px-6 py-16 space-y-8">
            <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold">
              <Code2 size={22} className="text-primary" aria-hidden="true" />
              Technical Stack
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skills).map(([category, items], i) => (
                <motion.div
                  key={category}
                  className="glass rounded-xl p-5 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <h3 className="text-sm font-medium text-accent">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </ParallaxSection>

        {/* Education */}
        <ParallaxSection offset={15}>
          <section aria-label="Education" className="max-w-4xl mx-auto px-6 py-16 space-y-8">
            <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold">
              <GraduationCap size={22} className="text-primary" aria-hidden="true" />
              Education
            </h2>
            <motion.div
              className="glass rounded-xl p-6 text-center glow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-medium text-lg">{education.degree}</p>
              <p className="text-muted-foreground mt-1">{education.school} · {education.period}</p>
            </motion.div>
          </section>
        </ParallaxSection>

        {/* Contact */}
        <ParallaxSection offset={10}>
          <section aria-label="Contact" className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold">Let's build something</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Open to senior and lead engineering roles and high-impact collaborations.
              The fastest way to reach me is email.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href={`mailto:${identity.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                <Mail size={16} aria-hidden="true" />
                {identity.email}
              </a>
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass text-foreground text-sm font-medium glow-hover transition-all"
                aria-label="LinkedIn profile (opens in new tab)"
              >
                <LinkedinIcon size={16} />
                LinkedIn
              </a>
            </div>
          </section>
        </ParallaxSection>
      </div>
    </MotionConfig>
  );
}
