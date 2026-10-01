import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import Icon from '../components/Icon';
import { services } from '../data/services';

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad relative">
      <div className="container-x">
        <SectionHeading index="05" kicker="What I do" title={<span id="services-title">What I can build for you.</span>} text="From a single API to a complete product with a web and mobile client." />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: 1200 }}>
          {services.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={(i % 4) * 0.07} className="h-full">
                <TiltCard max={7} lift={4} className="glass h-full rounded-3xl p-6 transition-shadow duration-300 hover:shadow-glow">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-bright/25 to-secondary/25 text-primary ring-1 ring-line/10">
                      <Icon name={s.icon} size={22} />
                    </span>
                    <span className="font-mono text-xs font-semibold text-muted">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
