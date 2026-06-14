import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { isSupabaseConfigured } from '../../../lib/supabaseClient.js';
import SEO from '../../../components/SEO/SEO.jsx';
import styles from './Login.module.css';

/* Inline eye icons — no extra dependency */
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.12 9.12 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }
    setBusy(true);
    setError('');
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate('/admin');
  };

  return (
    <main className={styles.page}>
      <SEO title="Admin sign in" />

      {/* Left — full-height image */}
      <div className={styles.visual}>
        <div className={styles.visualOverlay} />
        <div className={styles.visualContent}>
          <span className={styles.visualEyebrow}>Thiral</span>
          <p className={styles.visualQuote}>
            Transforming visions into timeless spaces through innovative
            architecture and thoughtful design.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className={styles.formSide}>
        <div className={styles.card}>
        <h1 className={styles.title}>Thiral<span className={styles.dot}>.</span> admin</h1>
        <p className={styles.hint}>Sign in with your Supabase admin account.</p>

        <label className={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label className={styles.label} htmlFor="password">Password</label>
        <div className={styles.passwordWrap}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={`${styles.input} ${styles.passwordInput}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} onClick={handleSubmit} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        </div>
      </div>
    </main>
  );
}