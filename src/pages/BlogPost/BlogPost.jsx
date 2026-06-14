import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO/SEO.jsx';
import DimensionRule from '../../components/DimensionRule/DimensionRule.jsx';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js';
import styles from './BlogPost.module.css';

/* Small recent-post card for the sidebar */
function RecentItem({ p }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = p.featured_image && !imgError;
  return (
    <Link to={`/blog/${p.slug}`} className={styles.recentItem}>
      <div className={styles.recentThumb}>
        {hasImage
          ? <img src={p.featured_image} alt="" loading="lazy" onError={() => setImgError(true)} />
          : <div className={styles.recentThumbFallback} />}
      </div>
      <div className={styles.recentBody}>
        <span className={styles.recentMeta}>{p.categories?.name || 'Journal'}</span>
        <span className={styles.recentTitle}>{p.title}</span>
      </div>
    </Link>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [tags, setTags] = useState([]);
  const [recent, setRecent] = useState([]);
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [status, setStatus] = useState('loading');
  const [imgError, setImgError] = useState(false);
  const bodyRef = useRef(null);

  /* ── Load post ── */
  useEffect(() => {
    if (!isSupabaseConfigured) { setStatus('missing'); return; }
    setStatus('loading');
    setImgError(false);
    supabase
      .from('posts')
      .select('*, categories(name, slug), post_tags(tags(id, name, slug))')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setStatus('missing'); return; }
        setPost(data);
        setTags((data.post_tags || []).map((pt) => pt.tags).filter(Boolean));
        setStatus('ready');
      });
  }, [slug]);

  /* ── Load recent posts (exclude current) ── */
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .from('posts')
      .select('id, slug, title, featured_image, categories(name)')
      .eq('published', true)
      .neq('slug', slug)
      .order('published_at', { ascending: false })
      .limit(4)
      .then(({ data }) => setRecent(data || []));
  }, [slug]);

  /* ── Build table of contents from rendered headings ── */
  useEffect(() => {
    if (status !== 'ready' || !bodyRef.current) return;
    const headings = bodyRef.current.querySelectorAll('h2, h3');
    const items = [];
    headings.forEach((h, i) => {
      const id = h.id || `heading-${i}`;
      h.id = id;
      items.push({ id, text: h.textContent, level: h.tagName === 'H3' ? 3 : 2 });
    });
    setToc(items);

    // Scroll-spy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [status, post]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (status === 'loading') {
    return <main className={styles.state}><p>Loading entry…</p></main>;
  }

  if (status === 'missing') {
    return (
      <main className={styles.state}>
        <h1 className={styles.missingTitle}>Entry not found</h1>
        <p>This journal entry may have been unpublished or moved.</p>
        <Link to="/blog" className={styles.backLink}>← Back to the journal</Link>
      </main>
    );
  }

  const published = new Date(post.published_at || post.created_at);
  const showHero = post.featured_image && !imgError;

  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <SEO
        title={post.title}
        description={post.excerpt || undefined}
        image={post.featured_image || undefined}
        type="article"
      />
      <article>
        <header className={`container ${styles.header}`}>
          <Link to="/blog" className={styles.backBtn}>← All journal entries</Link>
          <DimensionRule label={post.categories?.name || 'Journal'} />
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {post.title}
          </motion.h1>
          <div className={styles.meta}>
            <time dateTime={published.toISOString()}>
              {published.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
            {tags.length > 0 && (
              <span className={styles.tags}>
                {tags.map((t) => <span key={t.id} className={styles.tag}>#{t.name}</span>)}
              </span>
            )}
          </div>
        </header>

        {showHero && (
          <motion.div
            className={styles.hero}
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={post.featured_image} alt={post.title} onError={() => setImgError(true)} />
          </motion.div>
        )}

        {/* Two-column: content + sidebar */}
        <div className={`container ${styles.layout}`}>
          <div className={styles.contentCol}>
            <div
              ref={bodyRef}
              className="post-body"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
            <div className={styles.footerNav}>
              <Link to="/blog" className={styles.backLink}>← All journal entries</Link>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>

              {/* Table of contents */}
              {toc.length > 0 && (
                <div className={styles.widget}>
                  <span className={styles.widgetTitle}>On this page</span>
                  <nav className={styles.toc}>
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        className={`${styles.tocLink} ${item.level === 3 ? styles.tocSub : ''} ${activeId === item.id ? styles.tocActive : ''}`}
                        onClick={() => scrollTo(item.id)}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Recent posts — always shown, with fallback */}
              <div className={styles.widget}>
                <span className={styles.widgetTitle}>Recent entries</span>
                {recent.length > 0 ? (
                  <div className={styles.recentList}>
                    {recent.map((p) => <RecentItem key={p.id} p={p} />)}
                  </div>
                ) : (
                  <p className={styles.recentEmpty}>
                    This is the latest from the journal. New writing is on its way.
                  </p>
                )}
              </div>

              {/* Explore CTA — always present */}
              <div className={`${styles.widget} ${styles.ctaWidget}`}>
                <span className={styles.ctaTitle}>Have a project in mind?</span>
                <p className={styles.ctaText}>
                  Let&rsquo;s talk about shaping your next space.
                </p>
                <Link to="/#contact" className={styles.ctaBtn}>
                  Start a conversation <span aria-hidden="true">→</span>
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </article>
    </motion.main>
  );
}