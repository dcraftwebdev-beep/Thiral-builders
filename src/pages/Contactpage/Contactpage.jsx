import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Contactpage.module.css';

gsap.registerPlugin(ScrollTrigger);

const INFO = [
  {
    key: 'mail',
    title: 'Mail Us 24/7',
    value: 'thiralbuilders@gmail.com',
    href: 'mailto:thiralbuilders@gmail.com',
    copy: 'We’re always here to answer your questions. Reach us anytime via email.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'location',
    title: 'Our Location',
    value: '4th Floor, Marina Towers, Chennai',
    href: 'https://www.google.com/maps/search/?api=1&query=Anna+Salai+Chennai',
    copy: 'Find us in the heart of the city, easy to access from all main routes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    key: 'call',
    title: 'Call Us 24/7',
    value: '+91 96555 73600, +91 96597 55649',
    href: 'tel:+919655573600',
    copy: 'Our support team is available day and night to assist you by phone.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 4h3l2 5-2 1.5a11 11 0 005.5 5.5L20 18l1 3-3 1A16 16 0 014 7l1-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const PROJECT_TYPES = ['Home Construction', 'Commercial Construction', 'Renovation & Remodeling', 'Consulting'];
const BUDGETS = ['Under ₹10L', '₹20L – ₹30L', '₹40L – ₹50L', 'Above ₹50L'];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Custom Dropdown Component
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const choose = (opt) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div
      className={`${styles.customSelect} ${isOpen ? styles.customSelectOpen : ''}`}
      ref={dropdownRef}
    >
      <div
        className={`${styles.input} ${styles.customSelectTrigger} ${!value ? styles.placeholder : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen((v) => !v); }
          if (e.key === 'Escape') setIsOpen(false);
        }}
      >
        <span>{value || placeholder}</span>
        <span
          className={styles.customSelectIcon}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
      {isOpen && (
        <div className={styles.customSelectDropdown} role="listbox">
          {options.map((opt) => (
            <div
              key={opt}
              className={`${styles.customSelectOption} ${opt === value ? styles.customSelectOptionActive : ''}`}
              role="option"
              aria-selected={opt === value}
              // prevent the trigger from blurring before the click registers
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EMPTY_FORM = {
  name: '',
  email: '',
  type: '',
  budget: '',
  message: '',
  save: false,
};

export default function ContactPage() {
  const pageRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // Helper for custom select fields
  const setDropdown = (key) => (val) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Restore saved name/email if the visitor opted in before
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('thiral_contact') || 'null');
      if (saved && (saved.name || saved.email)) {
        setForm((f) => ({ ...f, name: saved.name || '', email: saved.email || '', save: true }));
      }
    } catch { /* ignore */ }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email and message.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // remember-me
      if (form.save) {
        localStorage.setItem('thiral_contact', JSON.stringify({ name: form.name, email: form.email }));
      } else {
        localStorage.removeItem('thiral_contact');
      }

      // Keep the form visible — just clear the fields (except the saved
      // name/email if "remember me" is checked) and show the thank-you
      // note above it instead of replacing the form.
      setForm((f) => ({
        ...EMPTY_FORM,
        name: f.save ? f.name : '',
        email: f.save ? f.email : '',
        save: f.save,
      }));
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from(`.${styles.bannerTitle}`, {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          clearProps: 'transform',
        });
        gsap.from(`.${styles.infoCard}`, {
          y: 36,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: `.${styles.infoStrip}`, start: 'top 82%' },
        });
        gsap.from(`.${styles.formImage}`, {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: `.${styles.contactBody}`, start: 'top 70%' },
        });
        // IMPORTANT: clearProps wipes the leftover inline transform GSAP leaves
        // behind. Without it, each field keeps a transform, which makes it its
        // own stacking layer and hides the open dropdown behind later fields.
        gsap.from(`.${styles.field}`, {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: `.${styles.form}`, start: 'top 80%' },
        });
      }, pageRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <main className={styles.page} ref={pageRef}>
      {/* ---------- Banner header ---------- */}
      <header className={styles.banner}>
        <img
          className={styles.bannerImg}
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80"
          alt=""
          aria-hidden="true"
        />
        <div className={styles.bannerScrim} />
        <div className={styles.bannerInner}>
          <h1 className={styles.bannerTitle}>Contact Us</h1>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className={styles.crumbDash}>—</span>
            <span>Contact Us</span>
          </nav>
        </div>
      </header>

      {/* ---------- Icon info strip ---------- */}
      <section className={styles.infoStrip}>
        <div className={`container ${styles.infoGrid}`}>
          {INFO.map((it) => (
            <div className={styles.infoCard} key={it.key}>
              <div className={styles.infoTop}>
                <span className={styles.infoIcon}>{it.icon}</span>
                <div className={styles.infoHead}>
                  <h2 className={styles.infoTitle}>{it.title}</h2>
                  <a className={styles.infoValue} href={it.href}>{it.value}</a>
                </div>
              </div>
              <span className={styles.infoDivider} aria-hidden="true" />
              <p className={styles.infoCopy}>{it.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Image + form ---------- */}
      <section className={styles.contactBody}>
        <div className={`container ${styles.bodyGrid}`}>
          {/* left */}
          <div className={styles.bodyLeft}>
            <span className={styles.eyebrow}>Support — Quick Support</span>
            <h2 className={styles.bodyTitle}>We&rsquo;re Ready To Help You Anytime</h2>
            <p className={styles.bodyCopy}>
              Our team is always available to guide you through your project
              needs. We&rsquo;re here to make your journey simple and stress-free.
            </p>
            <img
              className={styles.formImage}
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Modern multi-storey home by Thiral Builders"
              loading="lazy"
            />
          </div>

          {/* right: form */}
          <div className={styles.bodyRight}>
            <span className={styles.eyebrow}>Contact Form</span>
            <h2 className={styles.bodyTitle}>Ask Us Anything!</h2>

            {/* Thank-you note appears above the form once sent — the form
                itself stays mounted and visible, just cleared, so the
                visitor can immediately send another enquiry if they want. */}
            {sent && (
              <div className={styles.thanksInline} role="status">
                <p className={styles.thanksInlineTitle}>Thank you — your message is in.</p>
                <p className={styles.thanksInlineCopy}>
                  We&rsquo;ll be in touch within two working days, usually sooner.
                </p>
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <input
                    className={styles.input}
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Name *"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <input
                    className={styles.input}
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="Email Id *"
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <CustomSelect
                    value={form.type}
                    onChange={setDropdown('type')}
                    options={PROJECT_TYPES}
                    placeholder="Project Type *"
                  />
                </div>
                <div className={styles.field}>
                  <CustomSelect
                    value={form.budget}
                    onChange={setDropdown('budget')}
                    options={BUDGETS}
                    placeholder="Select Your Budget…"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Message *"
                  required
                />
              </div>

              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={form.save}
                  onChange={(e) => setForm((f) => ({ ...f, save: e.target.checked }))}
                />
                <span>Save my name and email in this browser for the next time I comment.</span>
              </label>

              {error && <p className={styles.formError}>{error}</p>}

              <button type="submit" className={styles.submit} disabled={sending}>
                <span className={styles.submitArrow}>
                  <ArrowIcon />
                </span>
                {sending ? 'Sending…' : 'Submit Query'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}