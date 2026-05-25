import { motion } from 'motion/react';
import { MapPin, Mail, Briefcase, Code2, GraduationCap } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const experience = [
  {
    title: 'Senior Fullstack Engineer',
    company: 'Omio.com',
    period: '2025 – Present',
    location: 'Berlin, Germany',
    team: 'Platform Core & Payments',
    highlights: [
      'Cross-team leadership across Search Platform, UI Platform, and Frontend Chapter — raising the quality bar beyond the immediate team',
      'Owns payment integration, currency support, and error monitoring rework that sharply reduced alert noise',
      'Designed Cypress E2E testing framework for ancillaries and payment flows, adopted across teams',
      'AI-native workflow: applies AI tooling across documentation, code generation, review, and ops',
    ],
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Just Eat Takeaway',
    period: '2022 – 2025',
    location: 'Berlin, Germany',
    team: 'Core Platform',
    highlights: [
      'Led multi-market rollout of a core ordering platform across millions of active users',
      'Rebuilt frontend architecture for performance — new instrumentation cut MTTR by 40%',
      'CI/CD improvements and shared utilities reduced new engineer ramp-up time by 30%',
      'Grew four engineers through structured code reviews and pairing sessions',
    ],
  },
  {
    title: 'Senior Fullstack Engineer',
    company: 'Axon (taser.com)',
    period: '2019 – 2022',
    location: 'Remote',
    team: 'Core Platform',
    highlights: [
      'Delivered React + TypeScript architecture: 60% faster builds, halved frontend bug rates',
      'Shipped accessibility-compliant component library used across six products',
      'Deployed IAM microservices on Kubernetes with GitOps (Argo CD)',
      'Shaped UX of mission-critical tools used daily by thousands of law enforcement officers',
    ],
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Lazada (Alibaba Group)',
    period: '2017 – 2019',
    location: 'Vietnam',
    team: 'Checkout & Payments',
    highlights: [
      'Owned checkout and payment flows end-to-end — millions of transactions daily',
      'Built Incident & Risk Management tool adopted by Alibaba GOC 911',
      'Overhauled frontend deployment pipelines: release cycles from hours to minutes',
    ],
  },
];

const skills = {
  Frontend: ['React', 'Next.js', 'TypeScript', 'Redux', 'Zustand'],
  Backend: ['Node.js', 'REST', 'gRPC'],
  Infrastructure: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Argo CD'],
  Tooling: ['Monorepos', 'CI/CD', 'Jest', 'Playwright', 'Cypress'],
  'Design Systems': ['shadcn/ui', 'Material UI', 'Ant Design'],
  AI: ['LLM-assisted code gen', 'Documentation', 'Testing & Ops workflows'],
};

export default function MePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
      {/* Hero Quote */}
      <motion.section className="text-center space-y-8" {...fadeUp}>
        <blockquote className="text-2xl md:text-3xl font-light italic text-muted-foreground leading-relaxed">
          "The best way to predict the future is to invent it."
        </blockquote>
        <p className="text-sm text-muted-foreground/70">— Alan Kay</p>
      </motion.section>

      {/* Intro */}
      <motion.section className="space-y-4" {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }}>
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <MapPin size={14} />
          <span>Berlin, Germany</span>
          <span className="text-border">•</span>
          <Mail size={14} />
          <span>phatpt8@gmail.com</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="gradient-text">Phat Pham</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Eight years building high-traffic web platforms from zero to scale. I own problems
          end-to-end: from shaping the architecture and aligning stakeholders to shipping
          reliable, user-facing software at pace. Equally sharp working independently and
          leading cross-functional initiatives.
        </p>
      </motion.section>

      {/* Experience */}
      <motion.section className="space-y-8" {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }}>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Briefcase size={20} className="text-primary" />
          Experience
        </h2>

        <div className="space-y-6">
          {experience.map((job, i) => (
            <motion.div
              key={i}
              className="glass rounded-xl p-6 space-y-3 glow"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                  <p className="text-sm text-accent">{job.company} · {job.team}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {job.period} · {job.location}
                </div>
              </div>
              <ul className="space-y-1.5">
                {job.highlights.map((h, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary mt-1 shrink-0">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Earlier experience */}
        <div className="glass rounded-xl p-6 space-y-2">
          <h3 className="font-semibold text-foreground text-sm">Earlier</h3>
          <p className="text-sm text-muted-foreground">
            <strong>Fullstack Engineer, Apiumhub</strong> — React & Node.js delivery for SaaS clients.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>JavaScript Developer, FPT Online (vnexpress.net)</strong> — Frontend for Vietnam's largest online newspaper.
          </p>
        </div>
      </motion.section>

      {/* Technical Skills */}
      <motion.section className="space-y-8" {...fadeUp} transition={{ delay: 0.3, duration: 0.5 }}>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Code2 size={20} className="text-primary" />
          Technical Stack
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(skills).map(([category, items], i) => (
            <motion.div
              key={category}
              className="glass rounded-xl p-5 space-y-3"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
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
      </motion.section>

      {/* Education */}
      <motion.section className="space-y-4" {...fadeUp} transition={{ delay: 0.4, duration: 0.5 }}>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <GraduationCap size={20} className="text-primary" />
          Education
        </h2>
        <div className="glass rounded-xl p-5">
          <p className="font-medium">B.Sc. Computer Science</p>
          <p className="text-sm text-muted-foreground">FPT Greenwich University (UK), Vietnam · 2011–2016</p>
        </div>
      </motion.section>
    </div>
  );
}
