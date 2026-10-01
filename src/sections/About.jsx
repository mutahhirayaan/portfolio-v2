import { Rocket, Compass, Hammer } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import Icon from '../components/Icon';
import { TechIcon } from '../utils/techIcons';
import { aboutCards } from '../data/services';
import { site } from '../config/site';

const builds = ['Full stack web apps', 'REST APIs', 'Admin dashboards', 'Real-time features', 'Android apps from web code'];
const stack = ['react', 'javascript', 'tailwind', 'dotnet', 'csharp', 'sqlserver', 'mysql', 'capacitor'];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad relative">
      <div className="container-x">
        <SectionHeading index="01" kicker="About me" title={<span id="about-title">A developer who cares how it feels, not just how it works.</span>} />

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <Reveal className="space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                I'm <strong className="text-fg">{site.name}</strong>, a full stack web developer from {site.location.split(',')[0]}. I work on web and mobile products at{' '}
                <strong className="text-fg">{site.company.name}</strong>, where I build with React on the front and ASP.NET Core on the back.
              </p>
              <p>{site.intro}</p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Compass, title: 'Journey', text: 'Started full stack training in 2025 and moved quickly from tutorials to shipping real products.' },
                { icon: Rocket, title: 'Philosophy', text: 'Simple, readable code. Predictable APIs. Interfaces that respond the moment you touch them.' },
                { icon: Hammer, title: 'What I build', text: builds.join(', ') + '.' },
              ].map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08} className="glass rounded-3xl p-5">
                  <b.icon size={20} className="mb-3 text-primary" aria-hidden="true" />
                  <h3 className="font-display text-base font-bold">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.text}</p>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="mb-3 text-sm font-semibold text-muted">Technologies I work with</p>
              <ul className="flex flex-wrap gap-2.5">
                {stack.map((k) => (
                  <li key={k} className="glass flex h-11 w-11 items-center justify-center rounded-2xl"><TechIcon name={k} size={22} /></li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="grid gap-5 sm:grid-cols-2" style={{ perspective: 1200 }}>
            {aboutCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <TiltCard max={10} lift={4} className="glass-strong h-full rounded-3xl p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-bright/25 to-accent/25 text-primary ring-1 ring-line/10">
                      <Icon name={c.icon} size={22} />
                    </span>
                    <span className="font-mono text-xs font-semibold text-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold leading-snug">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
