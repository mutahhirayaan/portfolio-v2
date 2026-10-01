import { motion, useReducedMotion } from 'framer-motion';

/** Word-by-word masked reveal. Falls back to plain text with reduced motion. */
export default function SplitText({ text, className = '', delay = 0, stagger = 0.07 }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 18, delay: delay + i * stagger }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
