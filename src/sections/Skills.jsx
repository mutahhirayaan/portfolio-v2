import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import SkillCard from '../components/SkillCard';
import { skillCategories, skills } from '../data/skills';
import { cn } from '../utils/cn';

export default function Skills() {
  const [active, setActive] = useState(skillCategories[0]);
  const list = useMemo(() => skills.filter((s) => s.category === active), [active]);

  return (
    <section id="skills" aria-labelledby="skills-title" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          index="02"
          kicker="Skills"
          title={<span id="skills-title">The tools I reach for every day.</span>}
          text="Grouped by where they live in the stack. The dots show how comfortable I am, not a percentage score."
        />

        <div role="tablist" aria-label="Skill categories" className="mb-10 flex flex-wrap gap-2">
          {skillCategories.map((c) => {
            const count = skills.filter((s) => s.category === c).length;
            const on = c === active;
            return (
              <button
                key={c}
                role="tab"
                id={`tab-${c}`}
                aria-selected={on}
                aria-controls="skills-panel"
                onClick={() => setActive(c)}
                className={cn('relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors', on ? 'text-white' : 'glass text-muted hover:text-fg')}
              >
                {on && <motion.span layoutId="skill-tab" className="absolute inset-0 -z-0 rounded-full" style={{ backgroundImage: 'var(--btn-grad)' }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className="relative z-10">{c} <span className={cn('ml-1 text-xs', on ? 'text-white/80' : 'opacity-70')}>{count}</span></span>
              </button>
            );
          })}
        </div>

        <div id="skills-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
          <AnimatePresence mode="wait">
            <motion.ul
              key={active}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              style={{ perspective: 1200 }}
            >
              {list.map((s) => (
                <motion.li
                  key={s.name}
                  variants={{ hidden: { opacity: 0, y: 24, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } } }}
                >
                  <SkillCard skill={s} />
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
