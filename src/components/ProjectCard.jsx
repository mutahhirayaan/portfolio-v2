import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import BrowserFrame from './BrowserFrame';
import { useCanHover } from '../hooks/useMediaQuery';

const badgeVariants = {
  rest: { y: 0 },
  hover: (i) => ({ y: [0, -4, 0], transition: { delay: i * 0.04, duration: 0.45 } }),
};

export default function ProjectCard({ project }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const enabled = canHover && !reduce;
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });

  const onMove = (e) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    x.set(px * 12); y.set(py * 12); ry.set(px * 5); rx.set(-py * 5);
  };
  const onLeave = () => { x.set(0); y.set(0); rx.set(0); ry.set(0); };

  const [c1, c2] = project.theme || ['#06b6d4', '#6366f1'];

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      whileHover="hover"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={enabled ? { x, y, rotateX: rx, rotateY: ry, transformPerspective: 1000 } : undefined}
      className="group glass-strong relative flex flex-col overflow-hidden rounded-[2rem] p-4 transition-shadow duration-500 hover:shadow-glow"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(600px circle at 50% 0%, ${c1}22, transparent 60%)` }} />

      <Link to={`/projects/${project.slug}`} aria-label={`${project.title} case study`} className="block overflow-hidden rounded-2xl">
        <BrowserFrame
          src={project.image}
          alt={`${project.title} preview`}
          url={`${project.slug}.app`}
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="chip" style={{ color: c1 }}>{project.category}</span>
          <span className="text-xs font-semibold text-muted">{project.status} · {project.year}</span>
        </div>
        <h3 className="font-display text-2xl font-bold tracking-tight">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.slice(0, 6).map((t, i) => (
            <motion.li key={t} custom={i} variants={badgeVariants} className="rounded-full border border-line/15 bg-line/[0.05] px-2.5 py-1 text-[11px] font-semibold text-muted">{t}</motion.li>
          ))}
          {project.technologies.length > 6 && <li className="px-1.5 py-1 text-[11px] font-semibold text-muted">+{project.technologies.length - 6}</li>}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            to={`/projects/${project.slug}`}
            className="btn-primary !px-4 !py-2.5 transition-transform duration-300 group-hover:scale-[1.04]"
            style={{ backgroundImage: `linear-gradient(120deg, ${c1}, ${c2})` }}
          >
            View Details <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2.5" aria-label={`${project.title} on GitHub`}>
              <FaGithub size={15} aria-hidden="true" /> GitHub
            </a>
          )}
          {project.liveDemo && (
            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2.5" aria-label={`${project.title} live demo`}>
              <ExternalLink size={15} aria-hidden="true" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
