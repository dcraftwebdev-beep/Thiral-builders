import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../../../../components/Reveal/Reveal.jsx';
import DimensionRule from '../../../../components/DimensionRule/DimensionRule.jsx';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    name: 'The Courtyard Villas',
    location: 'ECR, Chennai',
  },
  {
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    name: 'Skyline Residences',
    location: 'OMR, Chennai',
  },
  {
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    name: 'Lakeview Heights',
    location: 'Porur, Chennai',
  },
  {
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    name: 'The Garden Enclave',
    location: 'Anna Nagar, Chennai',
  },
  {
    image:
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
    name: 'Heritage Row',
    location: 'Mylapore, Chennai',
  },
  {
    image:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    name: 'Westwood Terraces',
    location: 'Velachery, Chennai',
  },
  {
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    name: 'The Atrium',
    location: 'T. Nagar, Chennai',
  },
  {
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    name: 'Palm Crest',
    location: 'Adyar, Chennai',
  },
];

// Breakpoint below which we skip the pin + horizontal scroll-jack
const MOBILE_BREAKPOINT = 760;

export default function Projects() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const stripRef = useRef(null);

  useEffect(() => {
    // On mobile, do NOT set up the pin — render as a normal card stack.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    if (mql.matches) return undefined;

    const ctx = gsap.context(() => {
      const sec = wrapperRef.current;
      const pinWrap = stripRef.current;

      let pinWrapWidth;
      let horizontalScrollLength;

      function refresh() {
        pinWrapWidth = pinWrap.scrollWidth;
        horizontalScrollLength = pinWrapWidth - window.innerWidth;
      }
      refresh();

      gsap.to(pinWrap, {
        scrollTrigger: {
          scrub: true,
          trigger: sec,
          pin: sec,
          start: 'center center',
          end: () => `+=${pinWrapWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
        x: () => -horizontalScrollLength,
        ease: 'none',
      });

      ScrollTrigger.addEventListener('refreshInit', refresh);

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', refresh);
      };
    }, sectionRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    const imgs = stripRef.current
      ? Array.from(stripRef.current.querySelectorAll('img'))
      : [];
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onLoad, { once: true });
    });

    return () => {
      window.removeEventListener('load', onLoad);
      imgs.forEach((img) => img.removeEventListener('load', onLoad));
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.projects} id="projects" ref={sectionRef}>
      <div className="container">
        <DimensionRule label="03 — Projects" dark />
        <Reveal>
          <h2 className={styles.title}>Built by Thiral</h2>
        </Reveal>
      </div>

      <div className={styles.containerFluid}>
        <div className={styles.horizGalleryWrapper} ref={wrapperRef}>
          <div className={styles.horizGalleryStrip} ref={stripRef}>
            {PROJECTS.map((p) => (
              <div className={styles.projectWrap} key={p.name}>
                <img src={p.image} alt={`${p.name}, ${p.location}`} loading="lazy" />
                <div className={styles.projectMeta}>
                  <span className={styles.projectName}>{p.name}</span>
                  <span className={styles.projectLocation}>{p.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}