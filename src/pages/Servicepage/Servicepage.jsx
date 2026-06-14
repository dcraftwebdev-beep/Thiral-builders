import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Adjust these paths to match where ServicePage.jsx lives in your tree
import Reveal from '../../components/Reveal/Reveal.jsx';
import DimensionRule from '../../components/DimensionRule/DimensionRule.jsx';
import styles from './Servicepage.module.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    code: 'A',
    name: 'Architecture',
    copy:
      'We carry a project from the first feasibility sketch to the final site visit. Massing, orientation, planning strategy and construction detail are resolved as one continuous piece of thinking — never handed off between disconnected stages.',
    deliverables: ['Concept design', 'Planning submissions', 'Construction drawings', 'Site supervision'],
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80',
    alt: 'Modern architectural facade with clean concrete lines',
  },
  {
    code: 'B',
    name: 'Interior Design',
    copy:
      'Interiors are designed from the way a room is used, not from a mood board. We plan circulation and storage first, then build the material and lighting palette around how the space should feel at different hours of the day.',
    deliverables: ['Spatial planning', 'Joinery design', 'Lighting design', 'Material palettes'],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    alt: 'Warm minimal living room interior with natural materials',
  },
  {
    code: 'C',
    name: 'Renovation',
    copy:
      'Old buildings carry decisions worth keeping. We survey what exists, separate the structural from the sentimental, and intervene only where it earns its place — so the finished work reads as one building, not two eras stitched together.',
    deliverables: ['Condition surveys', 'Adaptive reuse', 'Heritage consent', 'Phased construction'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    alt: 'Construction site with scaffolding during restoration',
  },
  {
    code: 'D',
    name: 'Consulting',
    copy:
      'Before money is committed, we test the idea: what the site allows, what planning will accept, and what the numbers can carry. Clear documents, honest constraints, and a recommendation you can take to a lender or a board.',
    deliverables: ['Feasibility studies', 'Planning strategy', 'Design review', 'Tender support'],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80',
    alt: 'Engineers reviewing building plans on site',
  },
];

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z" />
  </svg>
);

export default function ServicePage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);
  const immersiveRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ---------- Hero: image parallax + subtle content reveal ---------- */
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // background image drifts slower than scroll
        gsap.to(heroImgRef.current, {
          yPercent: 22,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.from(`.${styles.line}`, {
          yPercent: 110,
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
        });
        gsap.from(`.${styles.heroEyebrow}`, {
          y: 16,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power3.out',
        });
        gsap.from(`.${styles.heroIntro}`, {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          delay: 0.5,
          ease: 'power3.out',
        });
      }, pageRef);
      return () => ctx.revert();
    });

    /* ---------- Desktop: pinned horizontal journey ---------- */
    mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const track = trackRef.current;
        const panels = gsap.utils.toArray(`.${styles.panel}`, track);

        const scrollTween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: immersiveRef.current,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => '+=' + (track.scrollWidth - window.innerWidth),
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              if (counterRef.current) {
                const idx = Math.min(
                  panels.length - 1,
                  Math.round(self.progress * (panels.length - 1))
                );
                counterRef.current.textContent = String(idx + 1).padStart(2, '0');
              }
            },
          },
        });

        panels.forEach((panel) => {
          const img = panel.querySelector(`.${styles.panelImg}`);
          const ghost = panel.querySelector(`.${styles.panelGhost}`);
          const bits = panel.querySelectorAll(`.${styles.anim}`);

          gsap.fromTo(
            img,
            { scale: 1.28 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );

          if (ghost) {
            gsap.fromTo(
              ghost,
              { xPercent: 14 },
              {
                xPercent: -14,
                ease: 'none',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              }
            );
          }

          gsap.from(bits, {
            y: 48,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left 62%',
            },
          });
        });
      }, pageRef);
      return () => ctx.revert();
    });

    /* ---------- Mobile: vertical stacked reveals ---------- */
    mm.add('(max-width: 860px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray(`.${styles.panel}`).forEach((panel) => {
          const img = panel.querySelector(`.${styles.panelFigure}`);
          const bits = panel.querySelectorAll(`.${styles.anim}`);

          gsap.fromTo(
            img,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.1,
              ease: 'power4.out',
              scrollTrigger: { trigger: panel, start: 'top 78%' },
            }
          );
          gsap.from(bits, {
            y: 36,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 70%' },
          });
        });
      }, pageRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <main className={styles.page} ref={pageRef}>
      {/* ---------- Hero (parallax image + overlaid content) ---------- */}
      <header className={styles.hero} ref={heroRef}>
        <div className={styles.heroBg} aria-hidden="true">
          <img
            ref={heroImgRef}
            className={styles.heroImg}
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2400&q=80"
            alt=""
          />
          <div className={styles.heroScrim} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroEyebrow}>What we do</span>
          <h1 className={styles.heroTitle}>
            <span className={styles.lineMask}>
              <span className={styles.line}>Services</span>
            </span>
          </h1>
          <p className={styles.heroIntro}>
            Four disciplines, one continuous way of working — from the first
            feasibility sketch to the final site visit, never handed off between
            disconnected stages.
          </p>
        </div>
      </header>

      {/* ---------- Immersive horizontal services ---------- */}
      <section className={styles.immersive} ref={immersiveRef}>
        <div className={styles.immersiveTop}>
          <span className={styles.immersiveLabel}>Our services</span>
          <div className={styles.progressWrap}>
            <span className={styles.progressBar} ref={progressRef} />
          </div>
          <span className={styles.counter}>
            <span ref={counterRef}>01</span> / {String(SERVICES.length).padStart(2, '0')}
          </span>
        </div>

        <div className={styles.viewport}>
          <div className={styles.track} ref={trackRef}>
            {SERVICES.map((s, i) => (
              <article className={styles.panel} key={s.code} id={`service-${s.code}`}>
                <div className={styles.panelFigure}>
                  <img className={styles.panelImg} src={s.image} alt={s.alt} loading="lazy" />
                  <span className={styles.panelGhost} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className={styles.panelText}>
                  <span className={`${styles.panelCode} ${styles.anim}`}>
                    {s.code} — Service
                  </span>
                  <h2 className={`${styles.panelName} ${styles.anim}`}>{s.name}</h2>
                  <p className={`${styles.panelCopy} ${styles.anim}`}>{s.copy}</p>
                  <ul className={`${styles.deliverables} ${styles.anim}`}>
                    {s.deliverables.map((d) => (
                      <li className={styles.deliverable} key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className={styles.cta}>
        <div className={styles.ctacontainer}>
          <Reveal>
            <h2 className={styles.ctaTitle}>Have a project in mind?</h2>
          </Reveal>
          <a href="/contact" className={styles.ctaBtn}>
            <span className={styles.ctaArrow}>
              <ArrowIcon />
            </span>
            Start a conversation
          </a>
        </div>
      </section>
    </main>
  );
}