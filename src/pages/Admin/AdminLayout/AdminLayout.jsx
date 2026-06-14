import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import styles from './AdminLayout.module.css';

/* Inline icons — no extra dependency */
const Icon = {
  posts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  new: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  taxonomy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  site: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  ),
  signout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.active : ''}`;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Thiral<span className={styles.brandDot}>.</span>
          <span className={styles.brandSub}>admin</span>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/admin" end className={linkClass}>
            <span className={styles.navIcon}>{Icon.posts}</span>
            Posts
          </NavLink>
          <NavLink to="/admin/posts/new" className={linkClass}>
            <span className={styles.navIcon}>{Icon.new}</span>
            New post
          </NavLink>
          <NavLink to="/admin/taxonomy" className={linkClass}>
            <span className={styles.navIcon}>{Icon.taxonomy}</span>
            Categories &amp; tags
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.navLink}>
            <span className={styles.navIcon}>{Icon.site}</span>
            View site
          </a>
          <button onClick={handleSignOut} className={`${styles.navLink} ${styles.signOut}`}>
            <span className={styles.navIcon}>{Icon.signout}</span>
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}