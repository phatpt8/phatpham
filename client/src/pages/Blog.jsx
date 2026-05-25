import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useEffect, useRef } from 'react';

function estimateReadTime(excerpt) {
  const words = excerpt?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const loadMoreRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: ({ pageParam }) => api.posts.list({ cursor: pageParam }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold gradient-text">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Thoughts on engineering, craft, and building things that matter.
        </p>
      </motion.div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse space-y-3">
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="glass rounded-xl p-12 text-center space-y-3">
          <p className="text-muted-foreground">No posts yet. The journey begins soon.</p>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="group glass rounded-xl p-6 block space-y-3 hover:border-primary/30 transition-all duration-300 hover:glow"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(post.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {estimateReadTime(post.excerpt)} min read
                </span>
              </div>

              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <span className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Read more <ArrowRight size={12} />
              </span>
            </Link>
          </motion.article>
        ))}
      </div>

      <div ref={loadMoreRef} className="py-8 text-center">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
