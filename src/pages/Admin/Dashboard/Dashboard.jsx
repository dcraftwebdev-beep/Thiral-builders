import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../../lib/supabaseClient.js';
import SEO from '../../../components/SEO/SEO.jsx';
import styles from './Dashboard.module.css';

function Thumb({ src }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div className={styles.thumbFallback} />;
  return <img src={src} alt="" className={styles.thumb} onError={() => setErr(true)} />;
}

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, published, published_at, updated_at, featured_image, categories(name)')
      .order('updated_at', { ascending: false });
    if (error) setMessage(error.message);
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const togglePublish = async (post) => {
    const next = !post.published;
    const { error } = await supabase
      .from('posts')
      .update({ published: next, published_at: next ? (post.published_at || new Date().toISOString()) : post.published_at })
      .eq('id', post.id);
    if (error) { setMessage(error.message); return; }
    setMessage(next ? 'Post published.' : 'Post unpublished.');
    load();
  };

  const remove = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (error) { setMessage(error.message); return; }
    setMessage('Post deleted.');
    load();
  };

  return (
    <div>
      <SEO title="Posts — Admin" />

      <nav className={styles.breadcrumb}>
        <Link to="/admin" className={styles.breadcrumbLink}>Admin</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span>Posts</span>
      </nav>

      <div className={styles.head}>
        <h1 className={styles.title}>Posts</h1>
        <Link to="/admin/posts/new" className={styles.newBtn}>+ New post</Link>
      </div>

      {message && <p className={styles.message}>{message}</p>}
      {!isSupabaseConfigured && <p className={styles.empty}>Supabase is not configured.</p>}
      {loading && <p className={styles.empty}>Loading…</p>}
      {!loading && isSupabaseConfigured && posts.length === 0 && (
        <p className={styles.empty}>No posts yet. Create your first one.</p>
      )}

      {posts.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 56 }} />
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className={styles.cellThumb}>
                    <Thumb src={p.featured_image} />
                  </td>
                  <td className={styles.cellTitle}>
                    <Link to={`/admin/posts/${p.id}`}>{p.title}</Link>
                    <span className={styles.slug}>/{p.slug}</span>
                  </td>
                  <td>{p.categories?.name || '—'}</td>
                  <td>
                    <span className={p.published ? styles.live : styles.draft}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className={styles.cellDate}>
                    {new Date(p.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className={styles.cellActions}>
                    <button className={styles.action} onClick={() => togglePublish(p)}>
                      {p.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link className={styles.action} to={`/admin/posts/${p.id}`}>Edit</Link>
                    <button className={`${styles.action} ${styles.danger}`} onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}