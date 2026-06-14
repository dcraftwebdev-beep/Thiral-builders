import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Adjust these paths to match where AboutPage.jsx lives in your tree
import Reveal from '../../components/Reveal/Reveal.jsx';
import DimensionRule from '../../components/DimensionRule/DimensionRule.jsx';
import styles from './AboutPage.module.css';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO = [
  'We', 'build', 'spaces', 'that', 'outlast',
  'the', 'people', 'who', 'design', 'them.',
];

const STATS = [
  { value: '20+', label: 'Years building' },
  { value: '120', label: 'Projects delivered' },
  { value: '4,500+', label: 'Families housed' },
  { value: '12', label: 'Design awards' },
];

const VALUES = [
  {
    title: 'Design around living',
    copy: 'Every plan starts from daily life — light, air, movement — not from a facade.',
  },
  {
    title: 'One team, one detail',
    copy: 'Architects, engineers and landscape work side by side from the first sketch.',
  },
  {
    title: 'Materials that age well',
    copy: 'We choose for the tenth year, not the handover photograph.',
  },
  {
    title: 'Care for what it stands in',
    copy: 'Water, energy and land are design inputs, never afterthoughts.',
  },
];

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z" />
  </svg>
);

export default function AboutPage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroPhotoRef = useRef(null);
  const manifestoRef = useRef(null);
  const buildRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        /* ---------- 1. PINNED HERO (white-out title + photo reveal) ---------- */
        gsap.fromTo(
          gsap.utils.toArray(`.${styles.heroWord}`),
          { yPercent: 120 },
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: 0.15 }
        );
        gsap.fromTo(
          `.${styles.heroMeta}`,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, delay: 0.9, ease: 'power3.out' }
        );

        gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=110%',
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
          .to(heroTitleRef.current, {
            scale: 0.42, yPercent: -18, color: '#ffffff', ease: 'power2.inOut',
          }, 0)
          .fromTo(
            heroPhotoRef.current,
            { scale: 1.35, opacity: 0.18, filter: 'brightness(0.5)' },
            { scale: 1, opacity: 1, filter: 'brightness(1)', ease: 'power2.inOut' },
            0
          )
          .to(`.${styles.heroMeta}`, { opacity: 0, ease: 'none' }, 0);

        /* ---------- 2. PINNED MANIFESTO (word build) ---------- */
        const words = gsap.utils.toArray(`.${styles.manifestoWord}`);
        gsap.timeline({
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: 'top top',
            end: `+=${words.length * 110}`,
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
          .fromTo(
            `.${styles.manifestoBg}`,
            { scale: 1.25, yPercent: -6 },
            { scale: 1, yPercent: 6, ease: 'none' },
            0
          )
          .fromTo(
            words,
            { opacity: 0.12, filter: 'blur(4px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.5, ease: 'none' },
            0
          );

        /* ---------- 3. STORY COLLAGE — layered parallax ---------- */
        gsap.utils.toArray(`.${styles.storyParallax}`).forEach((img) => {
          const depth = Number(img.dataset.depth || 10);
          gsap.fromTo(
            img,
            { yPercent: -depth },
            {
              yPercent: depth,
              ease: 'none',
              scrollTrigger: {
                trigger: `.${styles.storyStage}`,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });

        gsap.fromTo(
          `.${styles.storyGhost}`,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: `.${styles.storyStage}`,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );

        gsap.utils.toArray(`.${styles.storyFigure}`).forEach((fig, i) => {
          gsap.fromTo(
            fig,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.2,
              ease: 'power4.out',
              scrollTrigger: { trigger: fig, start: 'top 80%' },
              delay: i * 0.12,
            }
          );
        });

        gsap.fromTo(
          gsap.utils.toArray(`.${styles.storyCard} > *`),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: `.${styles.storyCard}`, start: 'top 85%' },
          }
        );

        /* ---------- 4. BUILD THE HOUSE (pinned assembly) ---------- */
        // Pivot every part around its own centre so rotations look right
        gsap.set(`.${styles.buildPart}`, { transformOrigin: '50% 50%' });

        const build = gsap.timeline({
          defaults: { ease: 'back.out(1.3)' },
          scrollTrigger: {
            trigger: buildRef.current,
            start: 'top top',
            end: '+=220%',
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        build
          // blueprint baseline fades + heading
          .from(`.${styles.bpGrid}`, { autoAlpha: 0, ease: 'none', duration: 0.4 }, 0)
          .from(`.${styles.ground}`, { scaleX: 0, autoAlpha: 0, ease: 'power2.out', duration: 0.5 }, 0.1)
          // foundation rises
          .from(`.${styles.foundation}`, { y: 150, autoAlpha: 0 }, 0.3)
          // two facade halves slide in and CONNECT at the centre seam
          .from(`.${styles.facadeLeft}`, { x: -340, rotation: -6, autoAlpha: 0 }, '>-0.05')
          .from(`.${styles.facadeRight}`, { x: 340, rotation: 6, autoAlpha: 0 }, '<')
          .from(`.${styles.nodeSeam}`, { scale: 0, autoAlpha: 0, ease: 'back.out(2.2)' }, '>-0.1')
          // roof slopes fly down and LOCK at the apex
          .from(`.${styles.roofLeft}`, { x: -260, y: -220, rotation: -28, autoAlpha: 0 }, '>')
          .from(`.${styles.roofRight}`, { x: 260, y: -220, rotation: 28, autoAlpha: 0 }, '<')
          .from(`.${styles.nodeApex}`, { scale: 0, autoAlpha: 0, ease: 'back.out(2.2)' }, '>-0.1')
          // chimney drops in
          .from(`.${styles.chimney}`, { y: -280, autoAlpha: 0 }, '>')
          // windows snap from the sides
          .from(`.${styles.windowLeft}`, { x: -200, scale: 0.6, autoAlpha: 0, ease: 'back.out(1.6)' }, '>-0.05')
          .from(`.${styles.windowRight}`, { x: 200, scale: 0.6, autoAlpha: 0, ease: 'back.out(1.6)' }, '<')
          // door rises and knob pops
          .from(`.${styles.door}`, { y: 170, autoAlpha: 0, ease: 'back.out(1.4)' }, '>')
          .from(`.${styles.doorknob}`, { scale: 0, autoAlpha: 0, ease: 'back.out(2.4)' }, '>-0.05')
          // tiny settle on the whole house
          .to(`.${styles.house}`, { scale: 1.015, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '>');

        // custom prop so the ground line can "draw" by scaling on X
        gsap.set(`.${styles.ground}`, { transformOrigin: '0% 50%' });
      }, pageRef);

      return () => ctx.revert();
    });

    /* Desktop-only hover wash on value rows */
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const rows = gsap.utils.toArray(`.${styles.valueRow}`);
      const handlers = rows.map((row) => {
        const fill = row.querySelector(`.${styles.valueFill}`);
        const enter = () => gsap.to(fill, { scaleY: 1, duration: 0.5, ease: 'power3.out' });
        const leave = () => gsap.to(fill, { scaleY: 0, duration: 0.4, ease: 'power3.in' });
        row.addEventListener('mouseenter', enter);
        row.addEventListener('mouseleave', leave);
        return { row, enter, leave };
      });
      return () => handlers.forEach(({ row, enter, leave }) => {
        row.removeEventListener('mouseenter', enter);
        row.removeEventListener('mouseleave', leave);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <main className={styles.page} ref={pageRef}>
      {/* ---------- 1. Pinned cinematic hero ---------- */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroPhoto} ref={heroPhotoRef} aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80"
            alt=""
          />
          <div className={styles.heroPhotoVeil} />
        </div>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle} ref={heroTitleRef}>
            <span className={styles.heroMask}><span className={styles.heroWord}>Thiral</span></span>
            <span className={styles.heroMask}><span className={styles.heroWord}>Builders</span></span>
          </h1>
          <div className={styles.heroMeta}>
            <span>Est. 2004</span>
            <span className={styles.heroMetaLine} aria-hidden="true" />
            <span>Architecture &amp; Construction</span>
          </div>
        </div>
      </section>

      {/* ---------- 2. Kinetic manifesto (pinned) ---------- */}
      <section className={styles.manifesto} ref={manifestoRef}>
        <div className={styles.manifestoBg} aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=80"
            alt=""
          />
        </div>
        <p className={styles.manifestoText}>
          {MANIFESTO.map((word, i) => (
            <span className={styles.manifestoWord} key={i}>{word}</span>
          ))}
        </p>
      </section>

      {/* ---------- 3. Story collage ---------- */}
      <section className={styles.story}>
        <div className="container">
          <DimensionRule label="Our story" dark />
          <div className={styles.storyStage}>
            <span className={styles.storyGhost} aria-hidden="true">
              SINCE<br />2004
            </span>

            <figure className={`${styles.storyFigure} ${styles.storyFigA}`}>
              <img
                className={styles.storyParallax}
                data-depth="12"
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80"
                alt="Concrete facade with clean architectural lines"
                loading="lazy"
              />
            </figure>

            <figure className={`${styles.storyFigure} ${styles.storyFigB}`}>
              <img
                className={styles.storyParallax}
                data-depth="7"
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
                alt="Warm minimal interior with natural materials"
                loading="lazy"
              />
            </figure>

            <div className={styles.storyCard}>
              <h2 className={styles.storyTitle}>Two decades,<br />one question</h2>
              <p>
                A handful of architects and engineers became one of the
                region&rsquo;s most trusted names — known for quality that
                outlasts its era.
              </p>
              <p>
                Every project begins the same way: how will people live here?
                Generous light, honest materials, layouts that still make sense
                ten years on.
              </p>
            </div>
          </div>
        </div>
      </section>

    

      {/* ---------- 5. Stats ---------- */}
      <section className={styles.stats}>
        <div className={`container ${styles.statsGrid}`}>
          {STATS.map((s) => (
            <div className={styles.stat} key={s.label}>
              <span className={styles.statNumber}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 6. How we work ---------- */}
      <section className={styles.values}>
        <div className="container">
          <DimensionRule label="How we work" />
          <Reveal>
            <h2 className={styles.valuesTitle}>What every project shares</h2>
          </Reveal>
          <ul className={styles.valuesList}>
            {VALUES.map((v, i) => (
              <li className={styles.valueRow} key={v.title}>
                <span className={styles.valueFill} aria-hidden="true" />
                <span className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.valueMain}>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueCopy}>{v.copy}</p>
                </div>
                <span className={styles.valueArrow}><ArrowIcon /></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 7. CTA ---------- */}
      <section className={styles.ctacontainer}>
        <div className={styles.cta}>
          <Reveal>
            <h2 className={styles.ctaTitle}>Build the next chapter with us</h2>
          </Reveal>
          <a href="/contact" className={styles.ctaBtn}>
            <span className={styles.ctaArrow}><ArrowIcon /></span>
            Start a conversation
          </a>
        </div>
      </section>
    </main>
  );
}