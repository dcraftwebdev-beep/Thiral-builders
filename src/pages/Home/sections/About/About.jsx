import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import styles from './About.module.css';
// Images
import about1 from '../../../../assests/about/about1.jpg';
import about2 from '../../../../assests/about/about2.jpg';
import about3 from '../../../../assests/about/about3.jpg';
import about4 from '../../../../assests/about/about4.jpg';
import about5 from '../../../../assests/about/about5.jpg';
import about6 from '../../../../assests/about/about6.jpg';
import about7 from '../../../../assests/about/about7.jpg';
import about8 from '../../../../assests/about/about8.jpg';

gsap.registerPlugin(ScrollTrigger, Flip);

const GALLERY_IMAGES = [
  about1,
  about2,
  about3,
  about4,
  about5,
  about6,
  about7,
  about8,
];

export default function About() {
  const galleryRef = useRef(null);

  useEffect(() => {
    let flipCtx;

    const createTween = () => {
      const galleryElement = galleryRef.current;
      if (!galleryElement) return;
      const galleryItems = galleryElement.querySelectorAll(
        `.${styles.galleryItem}`
      );

      flipCtx && flipCtx.revert();
      galleryElement.classList.remove(styles.galleryFinal);

      flipCtx = gsap.context(() => {
        // Temporarily add the final (full-bleed) class to capture the
        // end state, then Flip back from it.
        galleryElement.classList.add(styles.galleryFinal);
        const flipState = Flip.getState(galleryItems);
        galleryElement.classList.remove(styles.galleryFinal);

        const flip = Flip.to(flipState, {
          simple: true,
          ease: 'expoScale(1, 5)',
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: galleryElement,
            start: 'center center',
            end: '+=100%',
            scrub: true,
            pin: galleryElement.parentNode,
            // markers: true,
          },
        });
        tl.add(flip);

        return () => gsap.set(galleryItems, { clearProps: 'all' });
      });
    };

    createTween();
    window.addEventListener('resize', createTween);

    return () => {
      window.removeEventListener('resize', createTween);
      flipCtx && flipCtx.revert();
    };
  }, []);

  return (
    <>
      <div className={styles.galleryWrap}>
        <div
          className={`${styles.gallery} ${styles.galleryBento}`}
          ref={galleryRef}
        >
          {GALLERY_IMAGES.map((src, i) => (
            <div className={styles.galleryItem} key={i}>
              <img src={src} alt={`Thiral Builders project ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>About Thiral Builders</h2>
        <p>
          For over two decades, Thiral Builders has been shaping skylines and
          crafting communities across the region. What began as a small team
          of passionate architects and engineers has grown into one of the
          most trusted names in residential and commercial construction,
          known for uncompromising quality and designs that stand the test
          of time.
        </p>
        <p>
          Every project we undertake begins with a simple question: how will
          people live here? From premium villas and gated communities to
          modern apartment towers, our spaces are designed around real
          lifestyles — generous natural light, thoughtful layouts, and
          materials chosen for both beauty and durability.
        </p>
        <p>
          Our in-house design studio works hand in hand with structural
          engineers and landscape specialists, ensuring that every detail —
          from the foundation to the final finish — meets the standard our
          name carries. We don't just hand over keys; we hand over homes
          that families are proud of for generations.
        </p>
        <p>
          Sustainability is built into everything we do. Rainwater
          harvesting, solar-ready rooftops, and energy-efficient design are
          standard across our developments, because we believe the homes of
          tomorrow should care for the world they stand in.
        </p>
        <p>
          With thousands of happy families across our completed projects and
          a growing portfolio of upcoming developments in prime locations,
          Thiral Builders continues to do what we've always done — build
          spaces, shape dreams, and create legacies.
        </p>
      </div>
    </>
  );
}