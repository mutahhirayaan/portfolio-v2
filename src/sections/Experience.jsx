import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, Flag, FolderGit2, GraduationCap } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { timeline } from '../data/experience';
import { cn } from '../utils/cn';

const typeMeta = {
  work: { icon: Briefcase, label: 'Work' },
  education: { icon: GraduationCap, label: 'Education' },
  project: { icon: FolderGit2, label: 'Project' },
  milestone: { icon: Flag, label: 'Milestone' },
};

export default function Experience() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="experience" aria-labelledby="exp-title" className="section-pad relative">
      <div className="container-x">
        <SectionHeading index="04" kicker="Experience & journey" title={<span id="exp-title">From first tutorial to shipping products.</span>} />

        <ol ref={ref} className="relative mx-auto max-w-4xl">
          <span aria-hidden="true" className="absolute bottom-0 left-5 top-0 w-px bg-line/15 md:left-1/2" />
          <motion.span aria-hidden="true" style={{ scaleY: reduce ? 1 : scaleY, transformOrigin: 'top' }} className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-bright via-secondary to-accent shadow-[0_0_12px_rgb(var(--bright)/0.7)] md:left-1/2" />

          {timeline.map((t, i) => {
            const M = typeMeta[t.type];
            const left = i % 2 === 0;
            return (
              <motion.li
                key={`${t.title}-${i}`}
                initial={reduce ? false : { opacity: 0, x: left ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                className={cn('relative mb-10 pl-14 md:mb-12 md:w-1/2 md:pl-0', left ? 'md:pr-14' : 'md:ml-auto md:pl-14')}
              >
                <span className={cn('glass-strong absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full text-primary shadow-glow md:top-2', left ? 'md:left-auto md:right-[-1.25rem]' : 'md:left-[-1.25rem]')}>
                  <M.icon size={18} aria-hidden="true" />
                </span>
                <div className="glass rounded-3xl p-5 sm:p-6">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="chip text-primary">{t.year}</span>
                    <span className="text-xs font-semibold text-muted">{M.label}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold">{t.title}</h3>
                  <p className="text-sm font-semibold text-secondary">{t.place}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t.text}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
