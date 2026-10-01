import { motion, useTransform } from 'framer-motion';
import { useMouseParallax } from '../hooks/useMouseParallax';

const faces = [
  { label: '</>', t: 'rotateY(0deg)' },
  { label: '{ }', t: 'rotateY(90deg)' },
  { label: 'C#', t: 'rotateY(180deg)' },
  { label: 'JS', t: 'rotateY(-90deg)' },
  { label: '( )', t: 'rotateX(90deg)' },
  { label: 'API', t: 'rotateX(-90deg)' },
];

/** CSS 3D glass cube with code symbols. Slow spin + gentle pointer response. */
export default function GlassCube({ size = 112, className = '' }) {
  const { x, y } = useMouseParallax();
  const rotY = useTransform(x, [-1, 1], [-18, 18]);
  const rotX = useTransform(y, [-1, 1], [12, -12]);
  const half = size / 2;
  return (
    <div className={className} style={{ width: size, height: size, perspective: 700 }} aria-hidden="true">
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', width: size, height: size }}>
        <div className="cube animate-spin3d relative h-full w-full">
          {faces.map((f) => (
            <div key={f.label} className="cube-face" style={{ transform: `${f.t} translateZ(${half}px)`, fontSize: size * 0.24 }}>
              {f.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
