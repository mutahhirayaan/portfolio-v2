import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({ children, delay = 0, y = 24, className, as = 'div', ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 20, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
