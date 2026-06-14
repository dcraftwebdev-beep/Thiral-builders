import Reveal from '../../../../components/Reveal/Reveal.jsx';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">Now booking for Q4 2026</p>
          <h2 className={styles.title}>
            Ready to build, buy,<br />or <em>transform</em> your space?
          </h2>
          <p className={styles.sub}>
            Whether you're buying your first home, building from the ground up,
            or renovating what you already love — we've done it, and we'll do it right.
          </p>
          <a href="#contact" className={styles.button}>
            <span>Talk to us today</span>
          </a>
          <p className={styles.nudge}>Free site visit &nbsp;·&nbsp; No brokerage &nbsp;·&nbsp; Reply within 24 hrs</p>
        </Reveal>
      </div>
    </section>
  );
}