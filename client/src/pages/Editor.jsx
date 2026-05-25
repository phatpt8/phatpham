import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import MDEditor from '@uiw/react-md-editor';
import { Save, Eye, EyeOff, Send } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuthStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: existingPost } = useQuery({
    queryKey: ['post-edit', id],
    queryFn: () => api.posts.drafts().then((res) => res.posts.find((p) => p.id === parseInt(id))),
    enabled: !!id,
  });

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setTags(existingPost.tags.join(', '));
    }
  }, [existingPost]);

  useEffect(() => {
    if (id && existingPost) {
      api.posts.get(existingPost.slug).then((p) => setContent(p.content));
    }
  }, [id, existingPost]);

  const saveMutation = useMutation({
    mutationFn: (data) => (id ? api.posts.update(id, data) : api.posts.create(data)),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (!id) navigate(`/editor/${post.id}`, { replace: true });
      setSaving(false);
    },
  });

  const handleSave = (published = false) => {
    setSaving(true);
    saveMutation.mutate({
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      published,
    });
  };

  if (authLoading) return null;

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto px-6 py-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">
          {id ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving || !title}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !title || !content}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            Publish
          </button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="w-full px-4 py-3 text-xl font-semibold bg-transparent border border-border rounded-lg focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)..."
        className="w-full px-4 py-2 text-sm bg-transparent border border-border rounded-lg focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"
      />

      <div className="min-h-[500px] rounded-xl overflow-hidden border border-border" data-color-mode="dark">
        <MDEditor
          value={content}
          onChange={setContent}
          height={500}
          preview="live"
          className="!bg-card !border-none"
        />
      </div>

      {saveMutation.isError && (
        <p className="text-destructive text-sm">Error: {saveMutation.error.message}</p>
      )}
    </motion.div>
  );
}
