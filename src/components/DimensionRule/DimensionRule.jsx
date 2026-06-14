import styles from './DimensionRule.module.css';

/**
 * Signature motif: an architect's dimension line —
 * hairline rule with end ticks and a mono measurement label.
 * Used as section dividers / eyebrows across the site.
 */
export default function DimensionRule({ label, dark = false, align = 'left' }) {
  return (
    <div
      className={`${styles.rule} ${dark ? styles.dark : ''} ${align === 'center' ? styles.center : ''}`}
      aria-hidden={label ? undefined : true}
    >
      <span className={styles.tick} />
      <span className={styles.line} />
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.line} />
      <span className={styles.tick} />
    </div>
  );
}
