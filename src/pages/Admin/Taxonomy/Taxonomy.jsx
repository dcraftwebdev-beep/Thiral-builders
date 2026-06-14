import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabaseClient.js';
import SEO from '../../../components/SEO/SEO.jsx';
import styles from './Taxonomy.module.css';

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-');

function TaxonomyPanel({ table, label }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await supabase.from(table).select('id, name, slug').order('name');
    setItems(data || []);
  };

  useEffect(() => { if (isSupabaseConfigured) load(); }, []);

  const add = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError('');
    const { error: err } = await supabase
      .from(table)
      .insert({ name: trimmed, slug: slugify(trimmed) });
    if (err) { setError(err.message); return; }
    setName('');
    load();
  };

  const remove = async (item) => {
    const ok = window.confirm(`Delete "${item.name}"?`);
    if (!ok) return;
    const { error: err } = await supabase.from(table).delete().eq('id', item.id);
    if (err) { setError(err.message); return; }
    load();
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>{label}</h2>
      <div className={styles.addRow}>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`New ${label.toLowerCase().slice(0, -1)} name`}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button className={styles.addBtn} onClick={add}>Add</button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span>
              {item.name}
              <span className={styles.slug}>/{item.slug}</span>
            </span>
            <button className={styles.delete} onClick={() => remove(item)}>Delete</button>
          </li>
        ))}
        {items.length === 0 && <li className={styles.emptyRow}>Nothing here yet.</li>}
      </ul>
    </section>
  );
}

export default function Taxonomy() {
  if (!isSupabaseConfigured) {
    return <p className={styles.notice}>Supabase is not configured. Add your keys to .env first.</p>;
  }
  return (
    <div>
      <SEO title="Categories & tags — Admin" />
      <h1 className={styles.title}>Categories &amp; tags</h1>
      <div className={styles.grid}>
        <TaxonomyPanel table="categories" label="Categories" />
        <TaxonomyPanel table="tags" label="Tags" />
      </div>
    </div>
  );
}
