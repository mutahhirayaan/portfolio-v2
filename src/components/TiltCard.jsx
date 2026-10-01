import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useCanHover } from '../hooks/useMediaQuery';
import { cn } from '../utils/cn';

/** Pointer-driven 3D tilt with a soft glare. Disabled for touch devices and reduced motion. */
export default function TiltCard({ children, className, max = 8, lift = 0, glare = true, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const enabled = canHover && !reduce;
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 220, damping: 22 });
  const gx = useTransform(mx, (v) => v * 100);
  const gy = useTransform(my, (v) => v * 100);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(var(--bright) / 0.16), transparent 62%)`;

  const onMove = (e) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' } : undefined}
      whileHover={enabled && lift ? { y: -lift } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={cn('group relative', className)}
      {...rest}
    >
      {children}
      {glare && enabled && (
        <motion.div
          aria-hidden="true"
          style={{ background: bg }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </motion.div>
  );
}
