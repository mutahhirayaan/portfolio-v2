import { useState } from 'react';
import { motion, useReducedMotion, useTransform } from 'framer-motion';
import { Activity, Code2 } from 'lucide-react';
import TiltCard from './TiltCard';
import GlassCube from './GlassCube';
import { TechIcon } from '../utils/techIcons';
import { site } from '../config/site';
import { useMouseParallax } from '../hooks/useMouseParallax';

const badges = [
  { icon: 'react', label: 'React', pos: 'left-[-6%] top-[10%]', depth: 26, delay: '0s' },
  { icon: 'dotnet', label: 'ASP.NET Core', pos: 'right-[-8%] top-[22%]', depth: 34, delay: '1.2s' },
  { icon: 'sqlserver', label: 'SQL Server', pos: 'left-[-4%] bottom-[24%]', depth: 22, delay: '0.6s' },
  { icon: 'signalr', label: 'SignalR', pos: 'right-[-2%] bottom-[10%]', depth: 30, delay: '1.8s' },
];

export default function ProfileCard() {
  const [src, setSrc] = useState(site.profileImage);
  const reduce = useReducedMotion();
  const { x, y } = useMouseParallax(40, 16);
  const bx = useTransform(x, [-1, 1], [-10, 10]);
  const by = useTransform(y, [-1, 1], [-8, 8]);

  return (
    <div className="relative mx-auto w-full max-w-[420px] px-6 py-8 sm:px-10">
      <div aria-hidden="true" className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-bright/30 via-secondary/25 to-accent/30 blur-3xl" />

      <TiltCard max={9} className="rounded-[2.5rem]">
        <div className="ring-spin rounded-[2.5rem] p-[3px]">
          <div className="glass-strong relative overflow-hidden rounded-[2.4rem] p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.9rem] bg-line/10">
              <img
                src={src}
                alt={site.profileAlt}
                width="640"
                height="800"
                fetchpriority="high"
                decoding="async"
                onError={() => src !== site.profileFallback && setSrc(site.profileFallback)}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg/55 via-transparent to-transparent" />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                <div className="glass-strong rounded-2xl px-3.5 py-2">
                  <p className="font-display text-sm font-bold leading-tight">{site.name}</p>
                  <p className="text-[11px] text-muted">{site.role}</p>
                </div>
                <span className="glass-strong flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
                  Open to work
                </span>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>

      {badges.map((b) => (
        <motion.div
          key={b.label}
          style={reduce ? undefined : { x: bx, y: by }}
          className={`absolute ${b.pos} z-10 hidden sm:block`}
        >
          <div className="glass-strong animate-float flex items-center gap-2 rounded-2xl px-3 py-2 shadow-soft" style={{ animationDelay: b.delay }}>
            <TechIcon name={b.icon} size={18} />
            <span className="text-xs font-semibold">{b.label}</span>
          </div>
        </motion.div>
      ))}

      <div className="absolute -bottom-2 -left-2 z-10 sm:-left-6 sm:bottom-4">
        <GlassCube size={84} className="animate-float" />
      </div>

      <motion.div
        style={reduce ? undefined : { x: bx }}
        className="absolute -top-1 right-2 z-10 hidden sm:block"
      >
        <div className="glass-strong animate-float rounded-2xl px-3.5 py-2.5 shadow-soft" style={{ animationDelay: '0.9s' }}>
          <p className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-500"><Activity size={12} aria-hidden="true" /> GET /api/health</p>
          <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-muted"><Code2 size={12} aria-hidden="true" /> 200 OK · 42ms</p>
        </div>
      </motion.div>
    </div>
  );
}
