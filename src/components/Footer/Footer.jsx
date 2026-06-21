import { Link } from 'react-router-dom';
import DimensionRule from '../DimensionRule/DimensionRule.jsx';
import styles from './Footer.module.css';
import logo from '../../assests/thirallogov2.png';
import { FaInstagram, FaBehance, FaLinkedinIn, FaWhatsapp, FaEnvelope, } from "react-icons/fa";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} id="contact">
      <div className="container">
        <DimensionRule label="Get in touch" dark />

        {/* ── Brand centre ── */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="thiral " className={styles.logo} />
            {/* <span className={styles.logoText}>Thiral</span> */}
          </Link>
          <p className={styles.tagline}>
            Thiral is dedicated to transforming visions into<br />
            timeless spaces through innovative architecture and<br />
            thoughtful design.
          </p>
          {/* <Link to="mailto:hello@thiral.studio" className="thiral-btn">
            <span className={styles.ctaArrow}>→</span>
            Request Consultation
          </Link> */}
          <div className={styles.ctaWrapper}>
            <Link
              to="https://wa.me/919655573600?text=Hi%20I%20am%20interested%20in%20your%20services"
              className="thiral-btn"
            // onClick={() => setOpen(false)}
            >
              <span className="thiral-btn-arrow" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                  <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z" />
                </svg>
              </span>
              Request Consultation
            </Link>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* ── Info grid ── */}
        <div className={styles.infoGrid}>
          {/* Support Links */}
          <div className={styles.infoCol}>
            <span className={styles.colTitle}>Studio</span>
            <p>14 Granite Row, Floor 3<br />Chennai 600 004, India</p>
          </div>

          <div className={styles.infoCol}>
            <span className={styles.colTitle}>Navigate</span>
            <Link to="/">Home</Link>
            <a href="/properties">Properties</a>
            <a href="/services">Services</a>
            <Link to="/blogs">Journal</Link>
          </div>

          <div className={styles.infoCol}>
            <span className={styles.colTitle}>Social</span>

            <div className={styles.socials}>
              <a href="https://www.instagram.com/thiralbuilders" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/919655573600"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href="mailto:thiralbuilders@gmail.com"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
              {/* <a href="#"><FaBehance /></a> */}
              {/* <a href="https://www.linkedin.com/company/thiralbuilders" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </a> */}
            </div>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.colTitle}>Hours</span>
            <p>Mon – Fri<br />09:30 – 18:30 IST</p>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={styles.bottom}>
          <span>© {year} Thiral builders. All rights reserved.</span>
          <Link to="/admin" className={styles.adminLink}>Admin</Link>
        </div>
      </div>
    </footer>
  );
}