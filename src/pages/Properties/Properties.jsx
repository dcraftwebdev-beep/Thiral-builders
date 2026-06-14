import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // free since GSAP 3.13
import styles from './Properties.module.css';
import { Link } from 'react-router-dom';
gsap.registerPlugin(ScrollTrigger, SplitText);

const PROPERTIES = [
  {
    name: 'Hillside View House',
    price: '$9,200',
    tag: 'For Rent',
    beds: '4+',
    baths: '3',
    area: '2,400 sq ft',
    image:
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Modern Hillside Home',
    price: '$58,000',
    tag: 'For Buy',
    beds: '3',
    baths: '2',
    area: '3,100 sq ft',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Dallas Townhouse',
    price: '$9,800',
    tag: 'For Buy',
    beds: '3',
    baths: '2',
    area: '980 sq ft',
    image:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Urban Modern House',
    price: '$34,000',
    tag: 'For Buy',
    beds: '4+',
    baths: '3',
    area: '4,200 sq ft',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
  },
];

const MARQUEE_ITEMS = [
  'Hillside',
  'Downtown Dallas',
  'Lakefront',
  'Uptown',
  'Garden District',
  'The Heights',
  'Riverside',
  'Oak Park',
];

/* Headline content: words + photo chips interleaved, scrolls horizontally */
const HERO_SEQUENCE = [
  { type: 'word', text: 'Find' },
  { type: 'word', text: 'a' },
  { type: 'word', text: 'place' },
  {
    type: 'chip',
    src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
  },
  { type: 'word', text: 'you\u2019ll' },
  { type: 'word', text: 'love' },
  {
    type: 'chip',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  { type: 'word', text: 'to' },
  { type: 'word', text: 'live' },
  { type: 'word', text: 'in.' },
  {
    type: 'chip',
    src: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
  },
];

const BedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 18V8a2 2 0 012-2h6v6h10a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.85) translate(2 2)" />
    <path d="M2 19h20M2 19v-3h20v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="10" r="1.6" fill="currentColor" />
  </svg>
);

const BathIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12V5.5A2.5 2.5 0 016.5 3v0A2.5 2.5 0 019 5.5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2 12h20v2a5 5 0 01-5 5H7a5 5 0 01-5-5v-2zM6 21l1-2M18 21l-1-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AreaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 9h3M4 15h3M17 9h3M17 15h3M9 4v3M15 4v3M9 17v3M15 17v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const HouseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
  </svg>
);

export default function Properties() {
  const pageRef = useRef(null);
  const horizontalRef = useRef(null);
  const horizontalTextRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let split;

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const wrapper = horizontalRef.current;
        const text = horizontalTextRef.current;

        // ---------- PINNED HORIZONTAL HERO ----------
        // The whole headline track scrubs sideways while the section is pinned.
        const scrollTween = gsap.to(text, {
          xPercent: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: true,
            // travel distance = the track's own width, so speed feels
            // consistent at any viewport size
            end: () => `+=${text.scrollWidth}`,
            invalidateOnRefresh: true,
          },
        });

        // Background photo slowly settles from a zoom while the pin scrubs
        gsap.fromTo(
          wrapper.querySelector(`.${styles.horizontalBg}`),
          { scale: 1.18, yPercent: -4 },
          {
            scale: 1,
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              end: () => `+=${text.scrollWidth}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        // Split only the word spans — chips stay untouched
        split = SplitText.create(
          text.querySelectorAll(`.${styles.hWord}`),
          { type: 'chars' }
        );

        // Chars tumble in as they enter from the right,
        // driven by the horizontal tween via containerAnimation
        split.chars.forEach((char) => {
          gsap.from(char, {
            yPercent: 'random(-120, 120)',
            rotation: 'random(-20, 20)',
            autoAlpha: 0,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: char,
              containerAnimation: scrollTween,
              start: 'left 100%',
              end: 'left 40%',
              scrub: 1,
            },
          });
        });

        // Photo chips sweep open as they ride in
        const chips = gsap.utils.toArray(`.${styles.chip}`, text);
        chips.forEach((chip) => {
          const img = chip.querySelector(`.${styles.chipImg}`);
          gsap.from(chip, {
            clipPath: 'inset(0% 100% 0% 0% round 60px)',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chip,
              containerAnimation: scrollTween,
              start: 'left 100%',
              end: 'left 45%',
              scrub: 1,
            },
          });
          gsap.from(img, {
            scale: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chip,
              containerAnimation: scrollTween,
              start: 'left 100%',
              end: 'left 30%',
              scrub: 1,
            },
          });
        });

        // ---------- MARQUEE: infinite loop reacting to scroll velocity ----------
        const track = marqueeTrackRef.current;
        const loop = gsap.to(track, {
          xPercent: -50,
          ease: 'none',
          duration: 30,
          repeat: -1,
        });

        const skewSetter = gsap.quickTo(track, 'skewX', {
          duration: 0.5,
          ease: 'power3.out',
        });
        const clampSkew = gsap.utils.clamp(-6, 6);
        const clampSpeed = gsap.utils.clamp(0.6, 4);

        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = self.getVelocity();
            skewSetter(clampSkew(v / -350));
            gsap.to(loop, {
              timeScale: clampSpeed(1 + Math.abs(v) / 1200),
              duration: 0.4,
              overwrite: true,
            });
            gsap.to(loop, {
              timeScale: 1,
              duration: 1,
              delay: 0.4,
              overwrite: false,
            });
          },
        });

        // ---------- LISTING CARDS: slide up into view on scroll ----------
        const cards = gsap.utils.toArray(`.${styles.card}`, gridRef.current);
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              delay: (i % 2) * 0.12,
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
              },
            }
          );
        });
      }, pageRef);

      return () => {
        if (split) split.revert();
        ctx.revert();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <main className={styles.page} ref={pageRef}>
      {/* ---------- Pinned horizontal headline with photo chips ---------- */}
      <section className={styles.horizontal} ref={horizontalRef}>
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80"
          alt=""
          aria-hidden="true"
          className={styles.horizontalBg}
        />
        <div className={styles.horizontalBgWash} aria-hidden="true" />

        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          Thiral Builders — Property Listings
        </span>

        <h1 className={styles.horizontalText} ref={horizontalTextRef}>
          {HERO_SEQUENCE.map((item, i) =>
            item.type === 'word' ? (
              <span className={styles.hWord} key={i}>
                {item.text}
              </span>
            ) : (
              <span className={styles.chip} key={i} aria-hidden="true">
                <img className={styles.chipImg} src={item.src} alt="" />
              </span>
            )
          )}
        </h1>

        <span className={styles.scrollHint} aria-hidden="true">
          Scroll
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </section>

      {/* ---------- Intro row (scrolls in after the pin releases) ---------- */}
      <section className={styles.introRow}>
        <p className={styles.intro}>
          Explore a range of properties built for comfort, location, and
          everyday living — from hillside homes to downtown townhouses.
        </p>
         <Link to="/#contact" className="thiral-btn thiral-btn--brass">
                  <span className="thiral-btn-arrow" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z"/>
                    </svg>
                  </span>
                  Explore All Listings
                </Link>
      </section>

      {/* ---------- Velocity-reactive location marquee ---------- */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack} ref={marqueeTrackRef}>
          {[0, 1].map((copy) => (
            <div className={styles.marqueeGroup} key={copy}>
              {MARQUEE_ITEMS.map((item) => (
                <span className={styles.marqueeItem} key={`${copy}-${item}`}>
                  {item}
                  <span className={styles.marqueeStar}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Listings (unchanged design) ---------- */}
      <section className={styles.listings} id="all">
        <div className={styles.grid} ref={gridRef}>
          {PROPERTIES.map((p) => (
            <article className={styles.card} key={p.name}>
              <img src={p.image} alt={p.name} className={styles.cardImage} />
              <span className={styles.tag}>
                <span className={styles.tagIcon}>
                  <HouseIcon />
                </span>
                {p.tag}
              </span>
              <div className={styles.cardOverlay}>
                <h3 className={styles.cardName}>{p.name}</h3>
                <p className={styles.cardPrice}>{p.price}</p>
                <div className={styles.cardStats}>
                  <span className={styles.stat}>
                    <BedIcon /> {p.beds}
                  </span>
                  <span className={styles.statDivider} aria-hidden="true" />
                  <span className={styles.stat}>
                    <BathIcon /> {p.baths}
                  </span>
                  <span className={styles.statDivider} aria-hidden="true" />
                  <span className={styles.stat}>
                    <AreaIcon /> {p.area}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}