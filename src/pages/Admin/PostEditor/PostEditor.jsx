import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase, isSupabaseConfigured } from '../../../lib/supabaseClient.js';
import SEO from '../../../components/SEO/SEO.jsx';
import styles from './PostEditor.module.css';

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block', 'link', 'image',
];

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [title, setTitle]               = useState('');
  const [slug, setSlug]                 = useState('');
  const [excerpt, setExcerpt]           = useState('');
  const [content, setContent]           = useState('');
  const [categoryId, setCategoryId]     = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [published, setPublished]       = useState(false);

  // featuredImage = the saved URL already in Supabase (from DB / previous save)
  const [featuredImage, setFeaturedImage] = useState('');
  // pendingFile = a newly-selected file NOT yet uploaded
  const [pendingFile, setPendingFile]   = useState(null);
  // previewUrl = local object URL for showing the pending file before upload
  const [previewUrl, setPreviewUrl]     = useState('');
  const [imgBroken, setImgBroken]       = useState(false);

  const [categories, setCategories]     = useState([]);
  const [tags, setTags]                 = useState([]);
  const [busy, setBusy]                 = useState(false);
  const [message, setMessage]           = useState('');
  const fileRef = useRef();

  /* ── Load taxonomy ── */
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data || []));
    supabase.from('tags').select('*').order('name').then(({ data }) => setTags(data || []));
  }, []);

  /* ── Load existing post ── */
  useEffect(() => {
    if (isNew || !isSupabaseConfigured) return;
    supabase
      .from('posts')
      .select('*, post_tags(tag_id)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setMessage('Post not found.'); return; }
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || '');
        setContent(data.content || '');
        setCategoryId(data.category_id || '');
        setPublished(data.published);
        setSelectedTags((data.post_tags || []).map((pt) => pt.tag_id));
        if (data.featured_image) {
          setFeaturedImage(data.featured_image);
          setImgBroken(false);
        }
      });
  }, [id, isNew]);

  /* Clean up object URLs to avoid memory leaks */
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (isNew) setSlug(slugify(val));
  };

  const toggleTag = (tagId) =>
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );

  /* ── Select file — NO upload yet, just preview locally ── */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(file);
    setPendingFile(file);
    setPreviewUrl(localUrl);
    setImgBroken(false);
    setMessage('Image ready — it will be uploaded when you save.');
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl('');
    setFeaturedImage('');
    setImgBroken(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ── Upload the pending file (called during save) ── */
  const uploadPendingImage = async () => {
    if (!pendingFile) return featuredImage; // nothing new, keep existing URL
    const ext = pendingFile.name.split('.').pop().toLowerCase();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(path, pendingFile, { upsert: true });
    if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);
    const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
    return data?.publicUrl || '';
  };

  /* ── Save (publish or draft) ── */
  const save = async (publishOverride) => {
    if (!title.trim()) { setMessage('Title is required.'); return; }
    setBusy(true);
    setMessage('');

    const isPublished = publishOverride !== undefined ? publishOverride : published;

    let imageUrl = featuredImage;
    try {
      imageUrl = await uploadPendingImage();
    } catch (err) {
      setMessage(err.message);
      setBusy(false);
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug || slugify(title),
      excerpt: excerpt.trim() || null,
      content: content || null,
      category_id: categoryId || null,
      featured_image: imageUrl || null,
      published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    let postId = id;

    if (isNew) {
      const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
      if (error) { setMessage(error.message); setBusy(false); return; }
      postId = data.id;
    } else {
      const { error } = await supabase.from('posts').update(payload).eq('id', id);
      if (error) { setMessage(error.message); setBusy(false); return; }
      await supabase.from('post_tags').delete().eq('post_id', id);
    }

    if (selectedTags.length) {
      await supabase.from('post_tags').insert(
        selectedTags.map((tag_id) => ({ post_id: postId, tag_id }))
      );
    }

    // Commit the uploaded URL into state, clear the pending file
    if (pendingFile) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFeaturedImage(imageUrl);
      setPendingFile(null);
      setPreviewUrl('');
    }

    setPublished(isPublished);
    setBusy(false);
    setMessage(isPublished ? 'Post published.' : 'Draft saved.');
    if (isNew) navigate(`/admin/posts/${postId}`);
  };

  // What to show in the preview: pending local preview wins, else saved URL
  const displayImage = previewUrl || featuredImage;
  const showUploadZone = !displayImage || imgBroken;

  return (
    <div className={styles.editor}>
      <SEO title={isNew ? 'New post — Admin' : `Edit: ${title}`} />

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to="/admin" className={styles.breadcrumbLink}>Admin</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <Link to="/admin/posts" className={styles.breadcrumbLink}>Posts</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span>{isNew ? 'New post' : title || 'Edit'}</span>
      </nav>

      {/* Header */}
      <div className={styles.head}>
        <h1 className={styles.title}>{isNew ? 'New post' : 'Edit post'}</h1>
        <div className={styles.headActions}>
          <label className={styles.publishToggle}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            {published ? 'Published' : 'Draft'}
          </label>
          <button className={styles.saveBtn} onClick={() => save()} disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.grid}>

        {/* Main column */}
        <div className={styles.main}>

          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Slug</label>
            <input
              className={styles.input}
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="post-slug"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Excerpt</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description shown in listings…"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Content</label>
            <div className={styles.quillWrap}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Write your post content here…"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.aside}>

          {/* Featured image */}
          <div className={styles.card}>
            <span className={styles.cardTitle}>Featured Image</span>
            <div className={styles.imageCard}>
              {showUploadZone ? (
                <div className={styles.uploadZone} onClick={() => fileRef.current?.click()}>
                  <span className={styles.uploadIcon}>↑</span>
                  <span>Click to select image</span>
                  <span className={styles.uploadHint}>JPG, PNG, WebP · 1200×630</span>
                </div>
              ) : (
                <div className={styles.imagePreviewWrap}>
                  <img
                    key={displayImage}
                    src={displayImage}
                    alt="Featured"
                    className={styles.preview}
                    onError={() => setImgBroken(true)}
                  />
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>

            {pendingFile && (
              <p className={styles.pendingNote}>Not uploaded yet — saves on Publish / Draft</p>
            )}

            {displayImage && !imgBroken && (
              <div className={styles.imageActions}>
                <button className={styles.replaceBtn} onClick={() => fileRef.current?.click()}>
                  Replace
                </button>
                <button className={styles.removeBtn} onClick={removeImage}>
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Category */}
          <div className={styles.card}>
            <span className={styles.cardTitle}>Category</span>
            <select
              className={styles.select}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className={styles.card}>
            <span className={styles.cardTitle}>Tags</span>
            <div className={styles.tagList}>
              {tags.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.tag} ${selectedTags.includes(t.id) ? styles.tagActive : ''}`}
                  onClick={() => toggleTag(t.id)}
                >
                  {t.name}
                </button>
              ))}
              {tags.length === 0 && (
                <span className={styles.empty}>No tags yet.</span>
              )}
            </div>
          </div>

          {/* Publish card */}
          <div className={styles.card}>
            <span className={styles.cardTitle}>Publishing</span>
            <span className={published ? styles.live : styles.draft}>
              {published ? 'Published' : 'Draft'}
            </span>
            <div className={styles.publishActions}>
              <button className={styles.publishNowBtn} onClick={() => save(true)} disabled={busy}>
                {busy ? 'Saving…' : 'Publish Now'}
              </button>
              <button className={styles.draftBtn} onClick={() => save(false)} disabled={busy}>
                Save as Draft
              </button>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}