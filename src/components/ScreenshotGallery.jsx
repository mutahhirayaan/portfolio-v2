import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import TiltCard from './TiltCard';

export default function ScreenshotGallery({ shots = [], title }) {
  const [index, setIndex] = useState(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const open = index !== null;

  const move = useCallback((d) => setIndex((i) => (i === null ? i : (i + d + shots.length) % shots.length)), [shots.length]);
  const close = useCallback(() => { setIndex(null); openerRef.current?.focus(); }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, close, move]);

  if (!shots.length) return null;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1200 }}>
        {shots.map((s, i) => (
          <li key={s.src}>
            <TiltCard max={7} lift={4} className="glass overflow-hidden rounded-2xl">
              <button type="button" onClick={(e) => { openerRef.current = e.currentTarget; setIndex(i); }} className="block w-full text-left" aria-label={`Enlarge screenshot: ${s.alt}`}>
                <div className="aspect-[16/10] overflow-hidden bg-line/5">
                  <img src={s.src} alt={s.alt} width="1280" height="800" loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="px-4 py-3 text-xs font-semibold text-muted">{s.caption || s.alt}</p>
              </button>
            </TiltCard>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} screenshots`}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          >
            <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="icon-btn absolute right-4 top-4 !text-white"><X size={20} /></button>
            {shots.length > 1 && (
              <>
                <button type="button" aria-label="Previous screenshot" onClick={(e) => { e.stopPropagation(); move(-1); }} className="icon-btn absolute left-3 top-1/2 -translate-y-1/2 !text-white sm:left-6"><ChevronLeft size={22} /></button>
                <button type="button" aria-label="Next screenshot" onClick={(e) => { e.stopPropagation(); move(1); }} className="icon-btn absolute right-3 top-1/2 -translate-y-1/2 !text-white sm:right-6"><ChevronRight size={22} /></button>
              </>
            )}
            <motion.figure
              key={index}
              initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className="max-h-full w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={shots[index].src} alt={shots[index].alt} className="max-h-[80vh] w-full rounded-2xl object-contain shadow-2xl" />
              <figcaption className="mt-3 text-center text-sm font-medium text-white/80">{shots[index].caption || shots[index].alt} · {index + 1}/{shots.length}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
