import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DimensionRule from '../../../../components/DimensionRule/DimensionRule.jsx';
import styles from './Stats.module.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 140, suffix: '+', label: 'Projects completed' },
  { value: 12, suffix: '', label: 'Years in practice' },
  { value: 9, suffix: '', label: 'Design awards' },
  { value: 96, suffix: '%', label: 'Clients who return' },
];

export default function Stats() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const numbers = ref.current.querySelectorAll('[data-count]');
      numbers.forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => { el.textContent = Math.round(obj.v); },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.stats} ref={ref}>
      <div className="container">
        <DimensionRule label="04 — In numbers" />
        <div className={styles.grid}>
          {STATS.map((s) => (
            <div className={styles.cell} key={s.label}>
              <span className={styles.value}>
                <span data-count={s.value}>0</span>
                {s.suffix}
              </span>
              <span className={styles.label}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
