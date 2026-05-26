import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Clock, ChevronDown } from 'lucide-react';
import { getPostBySlug, getAllPosts } from '../content';

function useNextPost(currentSlug) {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === currentSlug);
  return idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;
}

const confettiEmojis = ['🎉', '🥳', '✨', '🎊', '🥦', '🚀', '💜'];

function EndConfetti() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: confettiEmojis[i % confettiEmojis.length],
      x: Math.random() * 200 - 100,
      y: -(Math.random() * 120 + 40),
      rotate: Math.random() * 360,
      delay: Math.random() * 0.3,
      duration: 0.8 + Math.random() * 0.4,
    })),
  []);

  return (
    <div className="flex flex-col items-center gap-3 text-muted-foreground relative overflow-visible">
      <div className="relative w-0 h-0">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute text-lg pointer-events-none"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 1, rotate: p.rotate }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </div>
      <span className="text-sm">You've read them all! 🎉</span>
      <Link
        to="/blog"
        className="text-xs text-primary hover:underline"
      >
        ← Back to all posts
      </Link>
    </div>
  );
}

export default function PostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);
  const nextPost = useNextPost(slug);
  const [pullProgress, setPullProgress] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const triggeredRef = useRef(false);
  const threshold = 120;

  const bottomRef = useRef(null);
  const progressRef = useRef(0);
  const cooldownRef = useRef(false);

  const goToNext = useCallback(() => {
    if (!nextPost || triggeredRef.current || transitioning) return;
    triggeredRef.current = true;
    setTransitioning(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigate(`/blog/${nextPost.slug}`);
      setTransitioning(false);
      setPullProgress(0);
      triggeredRef.current = false;
      progressRef.current = 0;
    }, 600);
  }, [nextPost, navigate, transitioning]);

  const isAtBottom = useCallback(() => {
    const scrollBottom = window.innerHeight + window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    return docHeight - scrollBottom < 5;
  }, []);

  const updateProgress = useCallback((delta) => {
    if (triggeredRef.current || transitioning || cooldownRef.current) return;
    progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta));
    setPullProgress(progressRef.current);
    if (progressRef.current >= 1) goToNext();
  }, [goToNext, transitioning]);

  useEffect(() => {
    if (!nextPost) return;
    let lastScrollY = window.scrollY;
    let decayRaf = null;

    const decay = () => {
      if (triggeredRef.current || progressRef.current <= 0) return;
      progressRef.current = Math.max(0, progressRef.current - 0.02);
      setPullProgress(progressRef.current);
      if (progressRef.current > 0) decayRaf = requestAnimationFrame(decay);
    };

    const startDecay = () => {
      cancelAnimationFrame(decayRaf);
      decayRaf = requestAnimationFrame(decay);
    };

    let decayTimer = null;

    const handleWheel = (e) => {
      if (triggeredRef.current || cooldownRef.current) return;

      if (!isAtBottom()) {
        if (progressRef.current > 0) startDecay();
        return;
      }

      if (e.deltaY > 0) {
        cancelAnimationFrame(decayRaf);
        clearTimeout(decayTimer);
        updateProgress(e.deltaY * 0.001);
        decayTimer = setTimeout(startDecay, 200);
      } else if (e.deltaY < 0) {
        updateProgress(e.deltaY * 0.004);
      }
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY && progressRef.current > 0) {
        updateProgress(-0.05);
      }
      lastScrollY = currentY;
    };

    const handleTouchStart = (e) => {
      bottomRef.current = e.touches[0].clientY;
      cancelAnimationFrame(decayRaf);
      clearTimeout(decayTimer);
    };

    const handleTouchMove = (e) => {
      if (!bottomRef.current || triggeredRef.current || cooldownRef.current) return;
      if (!isAtBottom()) {
        if (progressRef.current > 0) startDecay();
        return;
      }

      const diff = bottomRef.current - e.touches[0].clientY;
      bottomRef.current = e.touches[0].clientY;

      if (diff > 0) {
        updateProgress(diff * 0.003);
      } else if (diff < 0) {
        updateProgress(diff * 0.01);
      }
    };

    const handleTouchEnd = () => {
      bottomRef.current = null;
      startDecay();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(decayRaf);
      clearTimeout(decayTimer);
    };
  }, [nextPost, transitioning, isAtBottom, updateProgress]);

  useEffect(() => {
    setPullProgress(0);
    progressRef.current = 0;
    triggeredRef.current = false;
    setTransitioning(false);
    cooldownRef.current = true;
    const timer = setTimeout(() => { cooldownRef.current = false; }, 1000);
    return () => clearTimeout(timer);
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="text-primary hover:underline mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.article
        className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: transitioning ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>

        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime} min read
            </span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-code:text-primary prose-code:font-mono prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-border
          prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
          prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground prose-blockquote:italic
          prose-li:text-muted-foreground
          prose-hr:border-border
          prose-th:text-foreground prose-td:text-muted-foreground
          prose-img:rounded-xl prose-img:border prose-img:border-border
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </motion.article>

      {/* Pull-to-next indicator or end-of-list */}
      <div className="flex flex-col items-center py-8 gap-2">
        {nextPost ? (
          pullProgress >= 1 ? (
            <div className="flex items-center justify-center py-2">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <button
              onClick={goToNext}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity duration-200"
              style={{ opacity: 0.4 + pullProgress * 0.6 }}
            >
              <ChevronDown
                size={18}
                className="text-primary transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${pullProgress * 8}px)` }}
              />
              <div className="relative overflow-hidden rounded-full bg-muted/50 border border-border px-4 py-1.5">
                <div
                  className="absolute inset-0 bg-primary/20 rounded-full origin-left transition-transform duration-300 ease-out"
                  style={{ transform: `scaleX(${pullProgress})` }}
                />
                <span className="relative text-xs text-muted-foreground">
                  Next: {nextPost.title}
                </span>
              </div>
            </button>
          )
        ) : (
          <EndConfetti />
        )}
      </div>
    </>
  );
}
