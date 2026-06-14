import { useEffect, useRef } from 'react';

export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);

  useEffect(() => {
    // Touch devices — skip entirely
    if (window.matchMedia('(hover: none)').matches) return;

    const ring = ringRef.current;
    const dot  = dotRef.current;

    let mouseX = -100;
    let mouseY = -100;
    let ringX  = -100;
    let ringY  = -100;
    let raf;
    let visible = false;

    // Show cursors only after first mouse move
    const show = () => {
      if (!visible) {
        ring.style.opacity = '1';
        dot.style.opacity  = '1';
        visible = true;
      }
    };

    // Dot follows cursor exactly
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top  = `${mouseY}px`;
      show();
    };

    // Ring lags behind — paper-float feel
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Hover state on interactive elements
    const addHover = () => {
      ring.classList.add('is-hovering');
      dot.classList.add('is-hovering');
    };
    const removeHover = () => {
      ring.classList.remove('is-hovering');
      dot.classList.remove('is-hovering');
    };

    const onDown = () => ring.classList.add('is-clicking');
    const onUp   = () => ring.classList.remove('is-clicking');

    const targets = 'a, button, [role="button"], input, label, select, textarea, [tabindex]';

    const attachHover = () => {
      document.querySelectorAll(targets).forEach((el) => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    };

    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });
    attachHover();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="cursor"
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
    </>
  );
}