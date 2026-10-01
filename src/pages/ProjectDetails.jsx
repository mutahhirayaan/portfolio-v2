import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import PageTransition from '../components/PageTransition';
import BrowserFrame from '../components/BrowserFrame';
import ScreenshotGallery from '../components/ScreenshotGallery';
import Reveal from '../components/Reveal';
import NotFound from './NotFound';
import { getProject, getProjects, trackProjectView } from '../services/projectService';
import { projects as staticProjects } from '../data/projects';
import { useSeo } from '../hooks/useSeo';
import { site } from '../config/site';

function Block({ id, title, children }) {
  return (
    <Reveal as="section" id={id} className="scroll-mt-28" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="mb-4 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      {children}
    </Reveal>
  );
}
const Prose = ({ children }) => <p className="max-w-3xl text-base leading-relaxed text-muted sm:text-lg">{children}</p>;

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(() => staticProjects.find((p) => p.slug === slug) || undefined);
  const [all, setAll] = useState(staticProjects);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let alive = true;
    setMissing(false);
    getProject(slug).then((p) => { if (!alive) return; if (p) setProject(p); else { setProject(undefined); setMissing(true); } });
    getProjects().then((l) => alive && setAll(l));
    trackProjectView(slug);
    return () => { alive = false; };
  }, [slug]);

  const jsonLd = useMemo(() => project && ({
    '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.description,
    creator: { '@type': 'Person', name: site.name }, keywords: project.technologies.join(', '),
  }), [project]);

  useSeo({ title: project?.title, description: project?.description, image: project?.image, path: `/projects/${slug}`, type: 'article', jsonLd });

  if (missing) return <NotFound />;
  if (!project) return <div className="min-h-screen" />;

  const i = all.findIndex((p) => p.slug === project.slug);
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const [c1, c2] = project.theme || ['#06b6d4', '#6366f1'];

  const toc = [
    ['overview', 'Overview'], ['problem', 'Problem & solution'], ['features', 'Key features'], ['tech', 'Technologies'], ['architecture', 'Architecture'],
    ['stack', 'Frontend & backend'], ['data', 'Database & auth'], ['api', 'API'], ['challenges', 'Challenges'], ['learned', 'What I learned'], ['screenshots', 'Screenshots'],
  ];

  return (
    <PageTransition>
      <article className="relative pb-24 pt-32 sm:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] opacity-40" style={{ background: `radial-gradient(60% 60% at 50% 0%, ${c1}55, transparent 70%)` }} />
        <div className="container-x">
          <Link to="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-fg"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link>

          <header className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="flex flex-wrap gap-2"><span className="chip" style={{ color: c1 }}>{project.category}</span><span className="chip">{project.status} · {project.year}</span></div>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">{project.title}</h1>
              <p className="mt-4 text-xl font-medium text-muted">{project.tagline}</p>
              <p className="mt-2 text-sm text-muted">Role: <span className="font-semibold text-fg">{project.role}</span></p>
              <div className="mt-7 flex flex-wrap gap-3">
                {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ backgroundImage: `linear-gradient(120deg, ${c1}, ${c2})` }}><FaGithub size={16} aria-hidden="true" /> GitHub repository</a>}
                {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="btn-ghost"><ExternalLink size={16} aria-hidden="true" /> Live demo</a>}
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 30, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 80, damping: 18 }} style={{ perspective: 1200 }}>
              <BrowserFrame src={project.image} alt={`${project.title} hero screenshot`} url={`${project.slug}.app`} priority className="shadow-glow" />
            </motion.div>
          </header>

          <div className="mt-20 grid gap-12 lg:grid-cols-[220px_1fr]">
            <nav aria-label="On this page" className="hidden lg:block">
              <ul className="sticky top-28 space-y-1 border-l border-line/15 text-sm">
                {toc.map(([id, label]) => (
                  <li key={id}><a href={`#${id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 font-medium text-muted transition-colors hover:border-bright hover:text-fg">{label}</a></li>
                ))}
              </ul>
            </nav>

            <div className="space-y-16">
              <Block id="overview" title="Overview"><Prose>{project.overview}</Prose></Block>

              <div id="problem" className="grid scroll-mt-28 gap-6 md:grid-cols-2">
                <Reveal className="glass rounded-3xl p-6"><h2 className="mb-3 font-display text-xl font-bold">The problem</h2><p className="text-muted">{project.problem}</p></Reveal>
                <Reveal delay={0.08} className="glass-strong rounded-3xl p-6"><h2 className="mb-3 font-display text-xl font-bold">The solution</h2><p className="text-muted">{project.solution}</p></Reveal>
              </div>

              <Block id="features" title="Key features">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="glass flex items-start gap-3 rounded-2xl p-4 text-sm text-muted"><Check size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />{f}</li>
                  ))}
                </ul>
              </Block>

              <Block id="tech" title="Technologies used">
                <ul className="flex flex-wrap gap-2.5">{project.technologies.map((t) => <li key={t} className="glass rounded-full px-4 py-2 text-sm font-semibold">{t}</li>)}</ul>
              </Block>

              <Block id="architecture" title="Architecture">
                <Prose>{project.architecture.summary}</Prose>
                <ol className="mt-6 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                  {project.architecture.layers.map((l, n) => (
                    <li key={l} className="flex items-center gap-3">
                      <span className="glass-strong rounded-2xl px-4 py-2.5 text-sm font-semibold">{l}</span>
                      {n < project.architecture.layers.length - 1 && <ArrowRight size={16} className="hidden text-primary md:block" aria-hidden="true" />}
                    </li>
                  ))}
                </ol>
              </Block>

              <div id="stack" className="grid scroll-mt-28 gap-6 md:grid-cols-2">
                <Reveal className="glass rounded-3xl p-6"><h2 className="mb-3 font-display text-xl font-bold">Frontend</h2><p className="text-muted">{project.frontendDetails}</p></Reveal>
                <Reveal delay={0.08} className="glass rounded-3xl p-6"><h2 className="mb-3 font-display text-xl font-bold">Backend</h2><p className="text-muted">{project.backendDetails}</p></Reveal>
              </div>

              <div id="data" className="grid scroll-mt-28 gap-6 md:grid-cols-2">
                <Reveal className="glass rounded-3xl p-6"><h2 className="mb-3 font-display text-xl font-bold">Database</h2><p className="text-muted">{project.database}</p></Reveal>
                <Reveal delay={0.08} className="glass rounded-3xl p-6"><h2 className="mb-3 font-display text-xl font-bold">Authentication</h2><p className="text-muted">{project.authentication}</p></Reveal>
              </div>

              <Block id="api" title="API information">
                <Prose>{project.api.summary}</Prose>
                <ul className="mt-5 space-y-2">
                  {project.api.endpoints.map((e) => <li key={e} className="glass overflow-x-auto rounded-xl px-4 py-2.5 font-mono text-xs sm:text-sm">{e}</li>)}
                </ul>
              </Block>

              <Block id="challenges" title="Challenges">
                <ul className="space-y-3">{project.challenges.map((c) => <li key={c} className="glass rounded-2xl p-4 text-sm text-muted">{c}</li>)}</ul>
              </Block>

              <Block id="learned" title="What I learned">
                <ul className="space-y-3">{project.learned.map((c) => <li key={c} className="flex items-start gap-3 text-muted"><ArrowUpRight size={18} className="mt-1 shrink-0 text-primary" aria-hidden="true" />{c}</li>)}</ul>
              </Block>

              <Block id="screenshots" title="Screenshots"><ScreenshotGallery shots={project.screenshots} title={project.title} /></Block>
            </div>
          </div>

          <nav aria-label="Project navigation" className="mt-24 grid gap-4 sm:grid-cols-2">
            {[{ p: prev, label: 'Previous project', Icon: ArrowLeft, right: false }, { p: next, label: 'Next project', Icon: ArrowRight, right: true }].map(({ p, label, Icon, right }) => (
              <Link key={label} to={`/projects/${p.slug}`} className={`glass group flex items-center gap-4 rounded-3xl p-5 transition-all hover:-translate-y-1 hover:shadow-glow ${right ? 'flex-row-reverse text-right' : ''}`}>
                <Icon size={22} className="shrink-0 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
                <span><span className="block text-xs font-semibold text-muted">{label}</span><span className="block font-display text-xl font-bold">{p.title}</span></span>
              </Link>
            ))}
          </nav>
        </div>
      </article>
    </PageTransition>
  );
}
