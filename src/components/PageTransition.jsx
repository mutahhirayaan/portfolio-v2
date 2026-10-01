import { motion, useReducedMotion } from 'framer-motion';

export default function PageTransition({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(4px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
