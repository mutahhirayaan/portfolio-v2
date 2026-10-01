import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { navLinks, site } from '../config/site';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useScrollToSection } from '../hooks/useScrollToSection';
import { cn } from '../utils/cn';

const ids = navLinks.map((l) => l.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const spy = useScrollSpy(ids, onHome);
  const active = onHome ? spy : null;
  const go = useScrollToSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  const nav = (id) => { setOpen(false); go(id); };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 110, damping: 18, delay: 0.1 }}
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2 transition-[background,box-shadow,border-color] duration-300 sm:px-4',
          scrolled || open ? 'glass-strong shadow-soft' : 'border border-transparent bg-transparent',
        )}
      >
        <button type="button" onClick={() => nav('home')} aria-label="Go to top" className="rounded-full p-1"><Logo /></button>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => nav(l.id)}
                aria-current={active === l.id ? 'true' : undefined}
                className={cn('relative rounded-full px-4 py-2 text-sm font-semibold transition-colors', active === l.id ? 'text-fg' : 'text-muted hover:text-fg')}
              >
                {active === l.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-line/[0.09] ring-1 ring-line/10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href={site.resumePath} target="_blank" rel="noopener noreferrer" className="btn-primary hidden !px-4 !py-2.5 sm:inline-flex">
            <FileText size={16} aria-hidden="true" /> Resume
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-5" aria-hidden="true">
              <motion.i className="absolute left-0 top-0 block h-0.5 w-5 rounded bg-current" animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }} />
              <motion.i className="absolute left-0 top-1.5 block h-0.5 w-5 rounded bg-current" animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.3 : 1 }} />
              <motion.i className="absolute left-0 top-3 block h-0.5 w-5 rounded bg-current" animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }} />
            </span>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="glass-strong mx-auto mt-2 max-w-6xl rounded-3xl p-3 shadow-soft lg:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <button
                    type="button"
                    onClick={() => nav(l.id)}
                    className={cn('w-full rounded-2xl px-4 py-3 text-left text-base font-semibold', active === l.id ? 'bg-line/[0.09] text-fg' : 'text-muted')}
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
              <li className="mt-2 px-1">
                <a href={site.resumePath} target="_blank" rel="noopener noreferrer" className="btn-primary w-full"><FileText size={16} aria-hidden="true" /> Resume</a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
