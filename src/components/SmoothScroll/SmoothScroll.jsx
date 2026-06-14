import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Premium smooth-scroll wrapper.
 * Lenis drives the scroll with a long, airy easing curve —
 * the "paper floating" feel — and stays in sync with GSAP ScrollTrigger.
 */
export default function SmoothScroll({ children, disabled = false }) {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (disabled) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      duration: 2.4,          // ← longer = more floaty drift (was 1.6)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      smoothWheel: true,
      wheelMultiplier: 0.65,  // ← slower response = paper drifting (was 0.9)
      touchMultiplier: 1.0,   // ← slightly slower on touch too (was 1.4)
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [disabled]);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  return children;
}