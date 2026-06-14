import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO/SEO.jsx';
import Reveal from '../../components/Reveal/Reveal.jsx';
import DimensionRule from '../../components/DimensionRule/DimensionRule.jsx';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js';
import styles from './Blog.module.css';

/* Per-card component so each has its own imgError state */
function PostCard({ p, i }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = p.featured_image && !imgError;

  return (
    <Reveal delay={(i % 3) * 0.08}>
      <Link to={`/blogs/${p.slug}`} className={styles.card}>
        <div className={styles.imageWrap}>
          {hasImage ? (
            <img
              src={p.featured_image}
              alt={p.title}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.imageFallback} />
          )}
        </div>
        <span className={styles.meta}>
          {p.categories?.name || 'Journal'} ·{' '}
          {new Date(p.published_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>
        <h2 className={styles.cardTitle}>{p.title}</h2>
        {p.excerpt && <p className={styles.excerpt}>{p.excerpt}</p>}
        <span className={styles.read}>Read More <span aria-hidden="true">→</span></span>
      </Link>
    </Reveal>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    Promise.all([
      supabase
        .from('posts')
        .select('id, slug, title, excerpt, featured_image, published_at, categories(id, name, slug)')
        .eq('published', true)
        .order('published_at', { ascending: false }),
      supabase.from('categories').select('id, name, slug').order('name'),
    ]).then(([postsRes, catsRes]) => {
      setPosts(postsRes.data || []);
      setCategories(catsRes.data || []);
      setLoading(false);
    });
  }, []);

  const visible = useMemo(
    () => (activeCat === 'all' ? posts : posts.filter((p) => p.categories?.id === activeCat)),
    [posts, activeCat]
  );

  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <SEO title="Journal" description="Notes on architecture, interiors and the craft of building — from the Lumora Studio journal." />
      <div className="container">
        <Link to="/" className={styles.backBtn}>← Back to Home</Link>
        <DimensionRule label="Journal" />
        <Reveal>
          <h1 className={styles.title}>Notes from<br />the drawing board</h1>
        </Reveal>

        {categories.length > 0 && (
          <div className={styles.filters} role="tablist" aria-label="Filter by category">
            <button
              role="tab"
              aria-selected={activeCat === 'all'}
              className={`${styles.filter} ${activeCat === 'all' ? styles.filterActive : ''}`}
              onClick={() => setActiveCat('all')}
            >All</button>
            {categories.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={activeCat === c.id}
                className={`${styles.filter} ${activeCat === c.id ? styles.filterActive : ''}`}
                onClick={() => setActiveCat(c.id)}
              >{c.name}</button>
            ))}
          </div>
        )}

        {loading && <p className={styles.empty}>Loading entries…</p>}
        {!loading && !isSupabaseConfigured && (
          <p className={styles.empty}>The journal is not connected yet.</p>
        )}
        {!loading && isSupabaseConfigured && visible.length === 0 && (
          <p className={styles.empty}>No entries here yet.</p>
        )}

        <div className={styles.grid}>
          {visible.map((p, i) => <PostCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </motion.main>
  );
}