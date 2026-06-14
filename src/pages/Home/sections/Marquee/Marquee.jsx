import styles from './Marquee.module.css';

const ITEMS = ['Residential', 'Workplace', 'Hospitality', 'Cultural', 'Renovation', 'Landscape'];

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS]; // duplicated for a seamless loop
  return (
    <section className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {track.map((item, i) => (
          <span className={styles.item} key={`${item}-${i}`}>
            {item}
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </section>
  );
}
