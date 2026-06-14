import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import styles from './PageTransition.module.css';

gsap.registerPlugin(MorphSVGPlugin);

const FLAT   = 'M 0 100 V 100 Q 50 100 100 100 V 100 z'; // hidden below
const CURVE  = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';     // wave coming in
const FULL   = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';       // full cover

export default function PageTransition() {
  const pathRef      = useRef(null);
  const overlayRef   = useRef(null);
  const location     = useLocation();
  const firstRender  = useRef(true);

  useEffect(() => {
    // Skip the very first mount — no transition on initial load
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const path    = pathRef.current;
    const overlay = overlayRef.current;

    const tl = gsap.timeline();

    // 1. Sweep UP — wave → full cover
    tl.set(path, { attr: { d: FLAT } })
      .set(overlay, { autoAlpha: 1 })
      .to(path, {
        attr: { d: CURVE },
        duration: 0.45,
        ease: 'power2.in',
      })
      .to(path, {
        attr: { d: FULL },
        duration: 0.4,
        ease: 'power2.out',
      })
      // 2. Hold for a beat, then sweep DOWN — full → flat
      .to(path, {
        attr: { d: CURVE },
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.1,
      })
      .to(path, {
        attr: { d: FLAT },
        duration: 0.45,
        ease: 'power2.out',
      })
      .set(overlay, { autoAlpha: 0 });

    return () => tl.kill();
  }, [location.pathname]);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      aria-hidden="true"
      style={{ opacity: 0, visibility: 'hidden' }}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="pg-grad" x1="0" y1="0" x2="99" y2="99" gradientUnits="userSpaceOnUse">
            <stop offset="0.2" stopColor="var(--brass)"     />
            <stop offset="1"   stopColor="var(--brass-soft)" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          className={styles.path}
          stroke="url(#pg-grad)"
          fill="url(#pg-grad)"
          strokeWidth="2px"
          vectorEffect="non-scaling-stroke"
          d={FLAT}
        />
      </svg>
    </div>
  );
}