import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ErrorBoundary from './ErrorBoundary';
import { useMediaQuery } from '../hooks/useMediaQuery';

const Scene3D = lazy(() => import('./three/Scene3D'));

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

/** CSS gradient mesh always renders; the WebGL scene loads only on capable, motion-friendly, wide screens. */
export default function HeroBackdrop() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '100px' });
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 900px)');
  const isDark = useSelector((s) => s.theme.mode === 'dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce || !wide || !webglAvailable()) return undefined;
    const start = () => setReady(true);
    if ('requestIdleCallback' in window) { const id = window.requestIdleCallback(start, { timeout: 1500 }); return () => window.cancelIdleCallback(id); }
    const t = setTimeout(start, 600);
    return () => clearTimeout(t);
  }, [reduce, wide]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div className="animate-drift absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-bright/20 blur-[110px]" />
      <div className="animate-drift absolute right-[-120px] top-1/3 h-[460px] w-[460px] rounded-full bg-accent/20 blur-[120px]" style={{ animationDelay: '-6s' }} />
      <div className="absolute bottom-[-160px] left-1/3 h-[380px] w-[380px] rounded-full bg-secondary/20 blur-[120px]" />
      {ready && (
        <div className="absolute inset-0 opacity-90">
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Scene3D isDark={isDark} active={inView} />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
