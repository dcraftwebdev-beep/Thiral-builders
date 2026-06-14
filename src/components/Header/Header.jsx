import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from 'framer-motion';
import styles from './Header.module.css';
import logo from '../../assests/thirallogo.png';

const NAV = [
  { to: '/properties', label: 'Properties', hash: false },
  { to: '/services',   label: 'Services',   hash: true  },
  { to: '/about',      label: 'About',      hash: true  },
  { to: '/blogs',      label: 'Blogs',      hash: true  },
  { to: '/contact',    label: 'Contact',    hash: true  },
];

const EASE = [0.22, 1, 0.36, 1];

/* Dropdown slides down from top */
const overlayVariants = {
  closed: { y: '-100%', transition: { duration: 0.5, ease: EASE } },
  open:   { y: '0%',    transition: { duration: 0.55, ease: EASE } },
};

const listVariants = {
  closed: {},
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const lineVariants = {
  closed: { y: '100%', opacity: 0, transition: { duration: 0.4, ease: EASE } },
  open:   { y: '0%',  opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [open,     setOpen]     = useState(false);
  const lastY = useRef(0);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > lastY.current && y > 140) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <motion.header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${open ? styles.menuOpen : ''}`}
        initial={{ y: '-110%' }}
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className={`container ${styles.inner}`}>
          {/* Logo — always visible */}
          <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
            <span className={styles.logoMark} aria-hidden="true">
              <img src={logo} alt="Thiral Logo" className={styles.logoImage} />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((item) => {
              const Inner = (
                <span className={styles.navFlip}>
                  <span className={styles.navFlipLine}>{item.label}</span>
                  <span className={styles.navFlipLine} aria-hidden="true">{item.label}</span>
                </span>
              );
              return item.hash ? (
                <a key={item.label} href={item.to} className={styles.navLink}>{Inner}</a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navActive : ''}`}
                  end
                >
                  {Inner}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link to="/contact" className={`thiral-btn thiral-btn--brass ${styles.cta}`}>
            <span className="thiral-btn-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z" />
              </svg>
            </span>
            Contact us
          </Link>

          {/* Burger — mobile only */}
          <button
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className={styles.progress}
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.nav
              className={styles.overlayNav}
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
              aria-label="Mobile"
            >
              {NAV.map((item, i) => (
                <div className={styles.overlayItem} key={item.label}>
                  <span className={styles.overlayIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.overlayMask}>
                    <motion.span className={styles.overlayLine} variants={lineVariants}>
                      {item.hash ? (
                        <a href={item.to} className={styles.overlayLink} onClick={() => setOpen(false)}>
                          {item.label}
                        </a>
                      ) : (
                        <Link to={item.to} className={styles.overlayLink} onClick={() => setOpen(false)}>
                          {item.label}
                        </Link>
                      )}
                    </motion.span>
                  </span>
                </div>
              ))}
            </motion.nav>

            <motion.div
              className={styles.overlayFoot}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <Link
                to="/contact"
                className="thiral-btn"
                onClick={() => setOpen(false)}
              >
                <span className="thiral-btn-arrow" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z" />
                  </svg>
                </span>
                Contact us
              </Link>
              <span className={styles.overlayMeta}>Est. 2004 — Architecture &amp; Construction</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}