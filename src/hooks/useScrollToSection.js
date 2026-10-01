import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** scrollTo('contact') works from any route: smooth-scrolls on home, navigates to /#contact elsewhere. */
export function useScrollToSection() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return useCallback((id) => {
    if (pathname === '/') {
      const el = id === 'home' ? document.body : document.getElementById(id);
      if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', id === 'home' ? '/' : `/#${id}`);
    } else {
      navigate({ pathname: '/', hash: id === 'home' ? '' : `#${id}` });
    }
  }, [pathname, navigate]);
}
