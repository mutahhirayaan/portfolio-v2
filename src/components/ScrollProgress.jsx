import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0 50%' }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-bright via-secondary to-accent"
    />
  );
}
