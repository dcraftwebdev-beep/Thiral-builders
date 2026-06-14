import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../../../../components/Reveal/Reveal.jsx';
import DimensionRule from '../../../../components/DimensionRule/DimensionRule.jsx';
import { supabase, isSupabaseConfigured } from '../../../../lib/supabaseClient.js';
import styles from './BlogPreview.module.css';

const FALLBACK = [
  { id: 'f1', slug: '#', title: 'Connect Supabase to publish your first journal entry', excerpt: 'Posts created in the admin dashboard will appear here automatically once your project keys are set in .env.', featured_image: 'https://picsum.photos/seed/lumora-b1/900/640', published_at: new Date().toISOString(), categories: { name: 'Studio Notes' } },
  { id: 'f2', slug: '#', title: 'Material studies: lime plaster in coastal climates', excerpt: 'Placeholder entry — replaced by live content from your blog.', featured_image: 'https://picsum.photos/seed/lumora-b2/900/640', published_at: new Date().toISOString(), categories: { name: 'Architecture' } },
  { id: 'f3', slug: '#', title: 'Daylight first: planning rooms around the sun', excerpt: 'Placeholder entry — replaced by live content from your blog.', featured_image: 'https://picsum.photos/seed/lumora-b3/900/640', published_at: new Date().toISOString(), categories: { name: 'Interiors' } },
];

export default function BlogPreview() {
  const [posts, setPosts] = useState(FALLBACK);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .from('posts')
      .select('id, slug, title, excerpt, featured_image, published_at, categories(name)')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length) setPosts(data);
      });
  }, []);

  return (
    <section className={styles.blog}>
      <div className="container">
        <DimensionRule label="07 — Journal" />
        <div className={styles.head}>
          <Reveal><h2 className={styles.title}>From the journal</h2></Reveal>
          <Reveal delay={0.1}>
            <Link to="/blogs" className={styles.allLink}>All journals <span aria-hidden="true">→</span></Link>
          </Reveal>
        </div>
        <div className={styles.grid}>
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <Link to={p.slug === '#' ? '/blog' : `/blog/${p.slug}`} className={styles.card}>
                <div className={styles.imageWrap}>
                  {p.featured_image && <img src={p.featured_image} alt="" loading="lazy" />}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.meta}>
                    {p.categories?.name || 'Journal'} · {new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  {p.excerpt && <p className={styles.excerpt}>{p.excerpt}</p>}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
