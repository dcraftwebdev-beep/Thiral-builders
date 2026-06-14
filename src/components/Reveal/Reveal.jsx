import { motion } from 'framer-motion';

/**
 * Scroll-triggered reveal: content drifts up and settles softly,
 * like a sheet of paper coming to rest.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 48,
  once = true,
  className,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
