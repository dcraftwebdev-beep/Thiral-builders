# Thiral — React + Vite + Supabase

A premium architecture & interior-design website with a Lenis-powered smooth
scrolling experience, GSAP + Framer Motion animations, and a complete
Supabase-backed blog with an admin dashboard.

> Note: this is an **original design in the same genre** as the Lumoria theme
> reference (premium architecture/studio site), not a copy of that commercial
> theme. All tokens live in `src/styles/global.css`, so colors, fonts and
> spacing are easy to retune.

---

## 1. Quick start

```bash
npm install
cp .env.example .env   # then fill in your Supabase keys
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## 2. Supabase setup

1. Create a project at https://supabase.com
2. **SQL** — open SQL Editor and run `supabase/schema.sql`
   (creates `posts`, `categories`, `tags`, `post_tags`, RLS policies, triggers,
   and seeds three categories).
3. **Storage** — create a **public** bucket named `blog-images`
   (the storage policies in the schema cover read/upload/update/delete).
4. **Admin user** — Authentication → Users → "Add user" → create an
   email + password user. That account signs in at `/admin/login`.
5. **Keys** — Project Settings → API → copy the URL and `anon` key into `.env`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

The Supabase client is created conditionally — the site runs fine (with
placeholder journal content) before the keys exist.

## 3. Routes

| Route               | Page                                   |
| ------------------- | -------------------------------------- |
| `/`                 | Home (hero, marquee, about, services, projects, stats, process, testimonials, journal preview, CTA) |
| `/blog`             | Journal listing with category filters  |
| `/blog/:slug`       | SEO-friendly post page                 |
| `/admin/login`      | Admin sign-in                          |
| `/admin`            | Post list — edit / delete / publish / unpublish |
| `/admin/posts/new`  | Create post (rich text, featured image upload, category, tags, slug) |
| `/admin/posts/:id`  | Edit post                              |
| `/admin/taxonomy`   | Manage categories & tags               |

## 4. Architecture notes

- **Folder structure** — every page and section has its own folder with a
  `.jsx` + `.module.css` pair. No inline styles; shared tokens in
  `global.css`.
- **Smooth scroll** — `components/SmoothScroll` wraps the app with Lenis
  (long exponential ease-out, ~1.6s duration → the soft "paper floating"
  feel) and keeps GSAP ScrollTrigger in sync via the GSAP ticker. It is
  disabled on `/admin/*` and respects `prefers-reduced-motion`.
- **Animations** — `components/Reveal` (Framer Motion) handles scroll-in
  reveals; GSAP drives the hero parallax and the stats counters; route
  changes fade via `AnimatePresence`; the header condenses on scroll with
  multi-event listeners (scroll + touchmove) for reliable mobile behavior.
- **Signature motif** — `DimensionRule`, an architect's dimension line used
  as section eyebrows/dividers.
- **SEO** — `react-helmet-async` per page; posts emit title, description,
  canonical, Open Graph and Twitter card tags; slugs are auto-generated and
  editable.
- **Performance** — manual vendor chunking in `vite.config.js`, lazy-loaded
  images, font preconnect, CSS modules per component.

## 5. Swapping placeholder images

All imagery uses `picsum.photos` seeds as placeholders. Replace the `src`
URLs in the Hero, Projects and BlogPreview sections with licensed project
photography before launch.
