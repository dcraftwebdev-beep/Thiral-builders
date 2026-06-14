import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DimensionRule from '../../../../components/DimensionRule/DimensionRule.jsx';
import styles from './Testimonials.module.css';

const QUOTES = [
  {
    quote:
      'They redrew our brief twice before a single wall moved — and the house is better for every one of those conversations.',
    name: 'Meera & Arjun S.',
    role: 'Courtyard House, Chennai',
  },
  {
    quote:
      'Our team walked into the new office and went quiet. Calm, bright, and somehow exactly the way we work.',
    name: 'Daniel K.',
    role: 'Mill Street Offices, Bengaluru',
  },
  {
    quote:
      'The renovation kept everything we loved about the old building and fixed everything we tolerated.',
    name: 'Lakshmi V.',
    role: 'Verandah Residence, Kochi',
  },
];

const ArrowSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z"/>
  </svg>
);

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const q = QUOTES[index];

  const prev = () => setIndex((i) => (i - 1 + QUOTES.length) % QUOTES.length);
  const next = () => setIndex((i) => (i + 1) % QUOTES.length);

  return (
    <section className={styles.testimonials}>
      <div className="container">
        <DimensionRule label="06 — Client words" dark align="center" />
        <div className={styles.stage}>
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              className={styles.figure}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className={styles.quote}>"{q.quote}"</blockquote>
              <figcaption className={styles.caption}>
                <span className={styles.name}>{q.name}</span>
                <span className={styles.role}>{q.role}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className={styles.controls}>
          {/* Prev — flipped arrow */}
          <button
            className={styles.arrowBtn}
            onClick={prev}
            aria-label="Previous testimonial"
          >
            <span className={styles.arrowCircle}>
              <ArrowSVG />
            </span>
          </button>

          {/* Progress dots */}
          <div className={styles.dots} role="tablist" aria-label="Testimonials">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial ${i + 1}`}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            className={styles.arrowBtn}
            onClick={next}
            aria-label="Next testimonial"
          >
            <span className={`${styles.arrowCircle} ${styles.arrowNext}`}>
              <ArrowSVG />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}