import { useEffect } from 'react';
import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useCanHover } from './useMediaQuery';

/** Returns spring-smoothed x/y in [-1, 1] following the pointer across the window. */
export function useMouseParallax(stiffness = 60, damping = 18) {
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const x = useSpring(rx, { stiffness, damping, mass: 0.6 });
  const y = useSpring(ry, { stiffness, damping, mass: 0.6 });
  useEffect(() => {
    if (reduce || !canHover) return undefined;
    const onMove = (e) => {
      rx.set((e.clientX / window.innerWidth) * 2 - 1);
      ry.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, canHover, rx, ry]);
  return { x, y };
}
