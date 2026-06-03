// Single source of truth for the static portfolio content shared by the
// /me and /me2 pages.

export const identity = {
  name: 'Phat Pham',
  role: 'Senior Software Engineer',
  location: 'Berlin, Germany',
  email: 'phatpt8@gmail.com',
  linkedin: 'https://www.linkedin.com/in/peter-pham8/',
  cvFile: 'ppham-resume.pdf',
  cvDownloadName: 'Phat_Pham_CV.pdf',
};

export const tagline =
  'I turn ambiguous problems into reliable, high-scale products, owning the path from architecture to shipping.';

export const about =
  'Building high-traffic web platforms from zero to scale. I own problems ' +
  'end-to-end, from shaping architecture and aligning stakeholders to shipping reliable, ' +
  'user-facing software at pace. Equally sharp working independently and leading ' +
  'cross-functional initiatives. I step into ambiguity, define the path forward, and ' +
  'bring others along rather than waiting for direction.';

export const titles = ['Software Engineer', 'Builder', 'Problem Solver', 'Visualizer'];

export const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

export const quotes = [
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
];

// Each role carries a single `accent` hex; per-page styling derives any tints it needs.
export const experience = [
  {
    title: 'Senior Fullstack Engineer',
    company: 'Omio.com',
    logo: 'https://www.google.com/s2/favicons?domain=omio.com&sz=64',
    accent: '#0077cc',
    period: '2025 – Present',
    location: 'Berlin, Germany',
    team: 'Platform Core & Payments',
    highlights: [
      'Drives technical direction across multiple projects spanning the search orchestrator, booking funnel, payment-as-a-service, and shared UI components, treating product conversion rate (CVR) and business metrics as first-class engineering goals',
      'Works in a build-and-fail-fast mode, shipping experiments quickly, measuring real impact, and doubling down on what moves the metrics',
      'Shifted to an AI-native way of working, embedding AI across daily engineering from planning and execution to verification, multiplying personal output and sharing the patterns org-wide',
      'Closed a cross-team error monitoring gap that cut on-call alert noise by 70%, making the on-call rotation calmer and faster to act on real incidents',
    ],
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Just Eat Takeaway',
    logo: 'https://www.google.com/s2/favicons?domain=justeattakeaway.com&sz=64',
    accent: '#ff8000',
    period: '2022 – 2025',
    location: 'Berlin, Germany',
    team: 'Core Platform',
    highlights: [
      'Grew into a go-to technical expert, solving a wide range of problems at massive scale and serving as the reliable person teammates turned to for hard technical questions',
      'Owned application infrastructure for a multi-market ordering platform, optimizing request traffic and data delivery across markets in close collaboration with Cloudflare Workers',
      'Drove many successful initiatives including large-scale page migrations, running A/B tests and short-lived experiments to validate ideas fast and improve the product at scale',
      'Adopted the latest technologies pragmatically and continued mentoring engineers into autonomous, confident contributors',
    ],
  },
  {
    title: 'Senior Fullstack Engineer',
    company: 'Axon (taser.com)',
    logo: 'https://www.google.com/s2/favicons?domain=axon.com&sz=64',
    accent: '#ffd100',
    period: '2019 – 2022',
    location: 'Remote',
    team: 'Core Platform',
    highlights: [
      'Built mission-critical software trusted by law enforcement, where correctness was non-negotiable and every technical detail mattered',
      'Drove decisions with evidence, validating ideas through proof-of-concepts and clear design documentation in a rigorous, heavily-documented engineering culture',
      'Supported and modernized a 20+ year-old legacy C# platform, leading a full-stack migration to React + TypeScript that cut build times 60% and halved production bug rates',
      'Shipped an accessibility-compliant component library adopted across 6 products and 40+ engineers, and began mentoring fellow engineers',
    ],
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Lazada (Alibaba Group)',
    logo: 'https://www.google.com/s2/favicons?domain=lazada.com&sz=64',
    accent: '#f0164e',
    period: '2017 – 2019',
    location: 'Vietnam',
    team: 'Checkout & Payments',
    highlights: [
      'Thrived in a high-pressure, planet-scale environment serving billions of users across Southeast Asia',
      'Became the domain expert for the checkout and payment funnel, owning the frontend that processed millions of transactions daily under strict latency SLAs (p99 < 200ms)',
      'Built an incident and risk management tool adopted by the Alibaba GOC 911 team, cutting escalation time from 15 minutes to under 2',
    ],
  },
];

export const earlier = [
  {
    role: 'Fullstack Engineer',
    company: 'Apiumhub',
    logo: null,
    description: 'React & Node.js delivery for SaaS clients.',
  },
  {
    role: 'JavaScript Developer',
    company: 'FPT Online (vnexpress.net)',
    logo: 'https://www.google.com/s2/favicons?domain=vnexpress.net&sz=64',
    description: "Frontend for Vietnam's largest online newspaper.",
  },
];

export const skills = {
  'Frontend & UI': ['React', 'Next.js', 'TypeScript', 'Micro-frontends', 'SSR/SSG', 'Performance Tuning'],
  'Backend & APIs': ['Node.js', 'REST', 'gRPC', 'Event-driven Architecture', 'Scala'],
  'System Design': ['Distributed Systems', 'Domain-Driven Design', 'CQRS', 'High Availability'],
  'Infrastructure': ['AWS', 'Kubernetes', 'Terraform', 'GitOps (Argo CD)', 'Observability'],
  'Engineering Excellence': ['TDD', 'E2E Testing', 'CI/CD Pipelines', 'Monorepo Architecture', 'ADRs'],
  'Leadership & AI': ['Technical Strategy', 'Cross-team Influence', 'Mentorship', 'AI-augmented Workflows'],
};

export const education = {
  degree: 'B.Sc. Computer Science',
  school: 'FPT Greenwich University (UK), Vietnam',
  period: '2011–2016',
};

// hex (#rrggbb) -> "r, g, b" for building rgba() tints from a single accent.
export function hexToRgbTriplet(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
