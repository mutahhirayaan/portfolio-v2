import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import TiltCard from './TiltCard';
import { TechIcon } from '../utils/techIcons';
import { levelLabels } from '../data/skills';

export default function SkillCard({ skill }) {
  return (
    <TiltCard max={9} lift={3} className="glass h-full rounded-3xl p-5 transition-shadow duration-300 hover:shadow-glow">
      <motion.div whileHover="hover" className="flex h-full flex-col">
        <div className="flex items-start justify-between">
          <motion.span
            variants={{ hover: { rotate: [0, -8, 8, 0], scale: 1.12 } }}
            transition={{ duration: 0.5 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-elevated/70 ring-1 ring-line/10"
          >
            <TechIcon name={skill.icon} size={30} />
          </motion.span>
          {skill.officialUrl && (
            <a href={skill.officialUrl} target="_blank" rel="noopener noreferrer" aria-label={`${skill.name} official site`} className="rounded-full p-1.5 text-muted opacity-0 transition-opacity hover:text-fg focus-visible:opacity-100 group-hover:opacity-100">
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
        <h3 className="mt-4 font-display text-base font-bold leading-snug">{skill.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{skill.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="chip">{skill.category}</span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted" title={levelLabels[skill.level]}>
            <span className="flex gap-1" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <i key={n} className={`h-1.5 w-1.5 rounded-full ${n <= skill.level ? 'bg-bright shadow-[0_0_6px_rgb(var(--bright))]' : 'bg-line/20'}`} />
              ))}
            </span>
            {levelLabels[skill.level]}
          </span>
        </div>
      </motion.div>
    </TiltCard>
  );
}
