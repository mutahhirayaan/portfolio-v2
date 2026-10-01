import { cloneElement, Suspense, useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ScrollProgress from '../components/ScrollProgress';

// Handles hash links (/#contact) and resets scroll on route changes.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      let tries = 0;
      const t = setInterval(() => {
        const el = document.getElementById(id);
        tries += 1;
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); clearInterval(t); }
        else if (tries > 20) clearInterval(t);
      }, 80);
      return () => clearInterval(t);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    return undefined;
  }, [pathname, hash]);
  return null;
}

export default function MainLayout() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  return (
    <>
      <a href="#main" className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-full bg-elevated px-4 py-2 text-sm font-semibold focus:translate-y-0">Skip to content</a>
      <ScrollProgress />
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-screen" />}>
          <AnimatePresence mode="wait" initial={false}>{outlet && cloneElement(outlet, { key: pathname })}</AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
