import { useEffect, useState } from 'react';

export function useScrollSpy(ids, enabled = true) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!enabled) return undefined;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids, enabled]);
  return active;
}
