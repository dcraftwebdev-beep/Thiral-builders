import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import hero from '../../../../assests/herothiral.webp';
import avatar1 from '../../../../assests/avatars/avatar1.jpg';
import avatar2 from '../../../../assests/avatars/avatar2.jpg';
import avatar3 from '../../../../assests/avatars/avatar3.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageRef = useRef(null);
  const imageInnerRef = useRef(null);
  const mainImageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textContainerRef.current,
        { scale: 1, yPercent: 0, opacity: 1 },
        {
          scale: 0.85,
          yPercent: -10,
          opacity: 0,
          ease: 'none',
          immediateRender: true,
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'top 30%',
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        imageInnerRef.current,
        { scale: 0.94 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'top 30%',
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        mainImageRef.current,
        { yPercent: -10, scale: 1.15 },
        {
          yPercent: 10,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    const img = mainImageRef.current;
    const refresh = () => ScrollTrigger.refresh();
    if (img) {
      if (img.complete) {
        refresh();
      } else {
        img.addEventListener('load', refresh);
      }
    }

    return () => {
      if (img) img.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.heroWrapper} ref={sectionRef}>
      <div className={styles.stickyContent} ref={textContainerRef}>
        <motion.div
  className={styles.userBadge}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.1 }}
>
   <div className={styles.avatars}>
    <img src={avatar1} alt="Happy homeowner" />
    <img src={avatar2} alt="Happy homeowner" />
    <img src={avatar3} alt="Happy homeowner" />
  </div>
  <span>100+ homes built and loved</span>
</motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Building Spaces, Shaping<br />
          Dreams, Creating<br />
          Legacies.
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Explore thoughtfully designed homes in premium locations, crafted to<br />
          match modern lifestyles with comfort, elegance, and long-term value.
        </motion.p>

        <motion.div
          className={styles.buttonGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Global button — dark variant ── */}
          <a href="/properties" className="thiral-btn thiral-btn--dark">
            <span className="thiral-btn-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z"/>
              </svg>
            </span>
            Explore Homes
          </a>

          {/* ── Global button — default light variant ── */}
          {/* <a href="#visit" className="thiral-btn">
            <span className="thiral-btn-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="M100,44.896V55.104H94.82449A27.66327,27.66327,0,0,0,68.22692,81.70112v5.104H58.01937v-5.104A37.41244,37.41244,0,0,1,69.95209,55.104H.08V44.896H69.95209A37.41244,37.41244,0,0,1,58.01937,18.29888v-5.104H68.22692v5.104A27.67577,27.67577,0,0,0,94.89644,44.896Z"/>
              </svg>
            </span>
            Book a Visit
          </a> */}
        </motion.div>
      </div>

      <div className={styles.imageRevealContainer} ref={imageRef}>
        <div className={styles.imageInner} ref={imageInnerRef}>
          <img
            src={hero}
            alt="Modern luxury home architecture at dusk"
            className={styles.mainImage}
            ref={mainImageRef}
          />
        </div>
      </div>
    </section>
  );
}