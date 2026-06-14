import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../../../../components/Reveal/Reveal.jsx';
import DimensionRule from '../../../../components/DimensionRule/DimensionRule.jsx';
import styles from './Services.module.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    code: 'A',
    name: 'Architecture',
    cta: 'Explore Designs',
    copy: 'New builds and extensions, from concept sketches to site supervision.',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80',
    alt: 'Modern architectural facade with clean concrete lines',
  },
  {
    code: 'B',
    name: 'Interior Design',
    cta: 'View Interiors',
    copy: 'Spatial planning, joinery, lighting and material palettes for homes and workplaces.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    alt: 'Warm minimal living room interior with natural materials',
  },
  {
    code: 'C',
    name: 'Renovation',
    cta: 'See Transformations',
    copy: 'Sensitive restoration and adaptive reuse that keeps a building\'s character intact.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    alt: 'Construction site with scaffolding during restoration',
  },
  {
    code: 'D',
    name: 'Consulting',
    cta: 'Learn More',
    copy: 'Feasibility studies, planning support and design reviews for developers and owners.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80',
    alt: 'Engineers reviewing building plans on site',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const deckRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(`.${styles.card}`, deckRef.current);

      cards.forEach((card, i) => {
        const inner = card.querySelector(`.${styles.cardInner}`);
        const photo = card.querySelector(`.${styles.cardImage} img`);

        // Inner image parallax — transform only, overscaled so edges
        // never show. Adds life to each card without touching color.
        gsap.fromTo(
          photo,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true, // direct tie to scroll = Lenis provides the easing
            },
          }
        );

        // Stacking: as the next card rises, this one ONLY scales back a
        // touch and settles upward. No opacity, no filters, no color
        // shift — pure transform, GPU-cheap, perfectly smooth.
        const next = cards[i + 1];
        if (next) {
          gsap.to(inner, {
            scale: 0.94,
            yPercent: -3,
            transformOrigin: 'center top',
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.services} id="services" ref={sectionRef}>
      <div className="container">
        <DimensionRule label="02 — Services" dark />
        <Reveal>
          <h2 className={styles.title}>What we take on</h2>
        </Reveal>
      </div>

      <div className={styles.deck} ref={deckRef}>
        {SERVICES.map((s, i) => (
          <div className={styles.card} key={s.code}>
            <article className={styles.cardInner}>
              <div className={styles.cardText}>
                <div className={styles.cardMeta}>
                  <span className={styles.code}>{s.code}.</span>
                  <span className={styles.index}>
                    {String(i + 1).padStart(2, '0')} /{' '}
                    {String(SERVICES.length).padStart(2, '0')}
                  </span>
                </div>
                <h3 className={styles.name}>{s.name}</h3>
                <p className={styles.copy}>{s.copy}</p>
                <button className={styles.cardBtn}>
                  <span className={styles.cardArrow} aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z" />
                    </svg>
                  </span>
                  {s.cta}
                </button>
              </div>
              <div className={styles.cardImage}>
                <img src={s.image} alt={s.alt} loading="lazy" />
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}