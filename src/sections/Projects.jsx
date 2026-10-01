import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { projectFilters } from '../data/projects';
import { getProjects } from '../services/projectService';
import { projects as staticProjects } from '../data/projects';
import { cn } from '../utils/cn';

export default function Projects() {
  const [all, setAll] = useState(staticProjects);
  const [filter, setFilter] = useState('All');

  useEffect(() => { let alive = true; getProjects().then((p) => alive && setAll(p)); return () => { alive = false; }; }, []);

  const shown = useMemo(() => (filter === 'All' ? all : all.filter((p) => (p.categories || [p.category]).includes(filter))), [all, filter]);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          index="03"
          kicker="Projects"
          title={<span id="projects-title">Things I've built and shipped.</span>}
          text="Each project has a full case study: the problem, the architecture, the challenges and what I learned."
        />

        <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
          {projectFilters.map((f) => {
            const on = f === filter;
            return (
              <button key={f} type="button" aria-pressed={on} onClick={() => setFilter(f)} className={cn('relative rounded-full px-5 py-2 text-sm font-semibold transition-colors', on ? 'text-white' : 'glass text-muted hover:text-fg')}>
                {on && <motion.span layoutId="project-filter" className="absolute inset-0 rounded-full" style={{ backgroundImage: 'var(--btn-grad)' }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className="relative z-10">{f}</span>
              </button>
            );
          })}
        </div>

        <LayoutGroup>
          <motion.div layout className="grid gap-7 md:grid-cols-2" style={{ perspective: 1400 }} aria-live="polite">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => <ProjectCard key={p.id} project={p} />)}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {shown.length === 0 && <p className="mt-6 text-muted">No projects in this category yet.</p>}
      </div>
    </section>
  );
}
