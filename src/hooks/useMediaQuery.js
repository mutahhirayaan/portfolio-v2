import { useEffect, useState } from 'react';

export function useMediaQuery(query, initial = false) {
  const [matches, setMatches] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export const useCanHover = () => useMediaQuery('(hover: hover) and (pointer: fine)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
