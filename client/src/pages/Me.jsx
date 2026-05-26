import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapPin, Mail, Briefcase, Code2, GraduationCap, Download } from 'lucide-react';
import { useThemeStore } from '../store/theme';

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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </div>
  );
}

const quotes = [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
];

const titles = ['Software Engineer', 'Builder', 'Problem Solver', 'Visualizer'];

const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

function FlipTitle() {
  const [display, setDisplay] = useState(titles[0]);
  const indexRef = useRef(0);

  useEffect(() => {
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
  }, []);

  return (
    <div className="h-8 sm:h-10 md:h-12 flex items-center font-mono">
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
  const src = `${import.meta.env.BASE_URL}phat-pham-graffiti-${theme}.png`;

  return (
    <div className="mb-3 sm:mb-4 select-none -mx-4 sm:-mx-8">
      <img
        src={src}
        alt="Phat Pham"
        className="h-40 sm:h-56 md:h-72 w-auto object-contain"
        draggable={false}
      />
    </div>
  );
}

const experience = [
  {
    title: 'Senior Fullstack Engineer',
    company: 'Omio.com',
    logo: 'https://www.google.com/s2/favicons?domain=omio.com&sz=64',
    colors: { bg: 'rgba(0, 119, 204, 0.08)', border: 'rgba(0, 119, 204, 0.25)', accent: '#0077cc' },
    period: '2025 – Present',
    location: 'Berlin, Germany',
    team: 'Platform Core & Payments',
    highlights: [
      'Drives technical direction across 4 teams (Search, UI Platform, Frontend Chapter, Payments), influencing architecture decisions at the org level',
      'Identified and solved a cross-team error monitoring gap that reduced on-call alert noise by 70%, unblocking 3 squads simultaneously',
      'Architected and delivered a Cypress E2E framework from zero, now the standard for payment and ancillary testing across the company',
      'Pioneered AI-augmented engineering workflows (code gen, docs, review automation), multiplying personal output 3x and sharing patterns org-wide',
    ],
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Just Eat Takeaway',
    logo: 'https://www.google.com/s2/favicons?domain=justeattakeaway.com&sz=64',
    colors: { bg: 'rgba(255, 128, 0, 0.08)', border: 'rgba(255, 128, 0, 0.25)', accent: '#ff8000' },
    period: '2022 – 2025',
    location: 'Berlin, Germany',
    team: 'Core Platform',
    highlights: [
      'Sole technical owner of a multi-market ordering platform rollout serving 15M+ monthly active users across 6 countries',
      'Redesigned the frontend observability layer from scratch, cutting mean time to resolution (MTTR) by 40% and enabling data-driven prioritisation',
      'Built CI/CD tooling and shared utilities that compressed new engineer onboarding from 3 weeks to under 1 week',
      'Mentored and grew 4 engineers into autonomous contributors through structured pairing and ownership delegation',
    ],
  },
  {
    title: 'Senior Fullstack Engineer',
    company: 'Axon (taser.com)',
    logo: 'https://www.google.com/s2/favicons?domain=axon.com&sz=64',
    colors: { bg: 'rgba(255, 209, 0, 0.08)', border: 'rgba(255, 209, 0, 0.25)', accent: '#ffd100' },
    period: '2019 – 2022',
    location: 'Remote',
    team: 'Core Platform',
    highlights: [
      'Led a full-stack migration from legacy C#/JS to React + TypeScript, cutting build times 60% and halving production bug rates',
      'Designed and shipped an accessibility-compliant component library adopted across 6 products and 40+ engineers',
      'Deployed identity and access management microservices on Kubernetes (Argo CD GitOps), achieving zero-downtime deploys and instant rollbacks',
      'Collaborated directly with designers and PMs to reshape UX of mission-critical tools used daily by 10,000+ law enforcement officers',
    ],
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Lazada (Alibaba Group)',
    logo: 'https://www.google.com/s2/favicons?domain=lazada.com&sz=64',
    colors: { bg: 'rgba(240, 22, 78, 0.08)', border: 'rgba(240, 22, 78, 0.25)', accent: '#f0164e' },
    period: '2017 – 2019',
    location: 'Vietnam',
    team: 'Checkout & Payments',
    highlights: [
      'Owned the entire checkout and payment frontend processing millions of transactions daily under strict latency SLAs (p99 < 200ms)',
      'Built an Incident & Risk Management tool adopted by Alibaba GOC 911, reducing escalation time from 15 min to under 2 min',
      'Re-engineered frontend deployment pipelines, compressing release cycles from 4 hours to 8 minutes',
    ],
  },
];

const skills = {
  'Frontend & UI': ['React', 'Next.js', 'TypeScript', 'Micro-frontends', 'SSR/SSG', 'Performance Tuning'],
  'Backend & APIs': ['Node.js', 'REST', 'gRPC', 'Event-driven Architecture', 'Scala'],
  'System Design': ['Distributed Systems', 'Domain-Driven Design', 'CQRS', 'High Availability'],
  'Infrastructure': ['AWS', 'Kubernetes', 'Terraform', 'GitOps (Argo CD)', 'Observability'],
  'Engineering Excellence': ['TDD', 'E2E Testing', 'CI/CD Pipelines', 'Monorepo Architecture', 'ADRs'],
  'Leadership & AI': ['Technical Strategy', 'Cross-team Influence', 'Mentorship', 'AI-augmented Workflows'],
};

function RotatingQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-4 min-h-[120px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <blockquote className="text-2xl md:text-3xl font-light italic text-muted-foreground leading-relaxed">
            "{quotes[index].text}"
          </blockquote>
          <p className="text-sm text-muted-foreground/70">— {quotes[index].author}</p>
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const mobileOffset = Math.round(offset * 0.3);
  const y = useTransform(scrollYProgress, [0, 1], [isMobile ? mobileOffset : offset, isMobile ? -mobileOffset : -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export default function MePage() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative">
      <GridBackground />

      {/* Hero Section — full viewport, centered */}
      <section ref={heroRef} className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-0">
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
              <MapPin size={14} />
              Berlin, Germany
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} />
              phatpt8@gmail.com
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <a
              href="https://www.linkedin.com/in/peter-pham8/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors"
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
              href={`${import.meta.env.BASE_URL}ppham-cv.pdf`}
              download="Phat_Pham_CV.pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              <Download size={16} />
              Download CV
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator — hidden on mobile */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-primary/60" />
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
            Eight years building high-traffic web platforms from zero to scale. I own problems
            end-to-end, from shaping architecture and aligning stakeholders to shipping reliable,
            user-facing software at pace. Equally sharp working independently and leading
            cross-functional initiatives. I step into ambiguity, define the path forward, and
            bring others along rather than waiting for direction.
          </motion.p>
        </section>
      </ParallaxSection>

      {/* Experience */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6 sm:space-y-8 relative">
        <ParallaxSection offset={20}>
          <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-semibold">
            <Briefcase size={20} className="text-primary" />
            Experience
          </h2>
        </ParallaxSection>

        <div className="relative space-y-4 sm:space-y-6">
          {/* Timeline line — desktop only */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden sm:block" />

          {experience.map((job, i) => (
            <motion.div
              key={i}
              className="rounded-xl p-4 sm:p-6 space-y-3 sm:ml-12 backdrop-blur-md transition-all duration-300"
              style={{
                background: job.colors.bg,
                border: `1px solid ${job.colors.border}`,
                boxShadow: `0 0 20px ${job.colors.bg}, 0 0 60px ${job.colors.bg}`,
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.01, boxShadow: `0 0 30px ${job.colors.border}, 0 0 80px ${job.colors.bg}` }}
            >
              {/* Timeline dot — desktop only */}
              <div
                className="absolute -left-[calc(3rem-5px)] top-8 w-2.5 h-2.5 rounded-full border-2 border-background hidden sm:block"
                style={{ backgroundColor: job.colors.accent }}
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
                    <p className="text-xs sm:text-sm" style={{ color: job.colors.accent }}>
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
                    <span className="mt-0.5 sm:mt-1 shrink-0" style={{ color: job.colors.accent }}>›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Earlier */}
          <motion.div
            className="glass rounded-xl p-4 sm:p-6 space-y-3 sm:ml-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold text-foreground text-sm">Earlier</h3>
            <div className="flex items-center gap-3">
              <CompanyLogo src={null} alt="Apiumhub" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>Fullstack Engineer, Apiumhub</strong>. React & Node.js delivery for SaaS clients.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CompanyLogo
                src="https://www.google.com/s2/favicons?domain=vnexpress.net&sz=64"
                alt="VnExpress"
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
              />
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>JavaScript Developer, FPT Online (vnexpress.net)</strong>. Frontend for Vietnam's largest online newspaper.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Skills */}
      <ParallaxSection offset={25}>
        <section className="max-w-4xl mx-auto px-6 py-16 space-y-8">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold">
            <Code2 size={22} className="text-primary" />
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
        <section className="max-w-4xl mx-auto px-6 py-16 space-y-8">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold">
            <GraduationCap size={22} className="text-primary" />
            Education
          </h2>
          <motion.div
            className="glass rounded-xl p-6 text-center glow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-medium text-lg">B.Sc. Computer Science</p>
            <p className="text-muted-foreground mt-1">FPT Greenwich University (UK), Vietnam · 2011–2016</p>
          </motion.div>
        </section>
      </ParallaxSection>
    </div>
  );
}
