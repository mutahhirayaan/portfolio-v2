import { useId } from 'react';
import { site } from '../config/site';

export function LogoMark({ size = 36 }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={`${site.name} logo`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.55" stopColor="#6366f1" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${id})`} />
      <rect x="2.5" y="2.5" width="43" height="43" rx="13.5" fill="none" stroke="#fff" strokeOpacity="0.35" />
      <path d="M15 19l-6 5 6 5M33 19l6 5-6 5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 15l-4 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-bold tracking-tight">{site.name}</span>
          <span className="block text-[11px] font-medium text-muted">Full Stack Developer</span>
        </span>
      )}
    </span>
  );
}
