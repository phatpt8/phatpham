import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { getAllPosts } from '../content';

const POSTS_PER_PAGE = 10;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const allPosts = useMemo(() => getAllPosts(), []);
  const [visible, setVisible] = useState(POSTS_PER_PAGE);

  const posts = allPosts.slice(0, visible);
  const hasMore = visible < allPosts.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
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

      {posts.length === 0 && (
        <div className="glass rounded-xl p-12 text-center space-y-3">
          <p className="text-muted-foreground">No posts yet. The journey begins soon.</p>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="group glass rounded-xl p-5 sm:p-6 block space-y-3 hover:border-primary/30 transition-all duration-300 hover:glow"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime} min read
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

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisible((v) => v + POSTS_PER_PAGE)}
            className="px-6 py-2.5 text-sm rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
