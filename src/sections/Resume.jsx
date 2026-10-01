import { Download, Eye, MessageCircle } from 'lucide-react';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import { site } from '../config/site';
import { useScrollToSection } from '../hooks/useScrollToSection';

export default function Resume() {
  const go = useScrollToSection();
  return (
    <section id="resume" aria-labelledby="resume-title" className="section-pad relative">
      <div className="container-x">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2.5rem] p-8 sm:p-14">
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-[90px]" />
            <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-bright/20 blur-[90px]" />
            <div className="relative grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 id="resume-title" className="font-display text-3xl font-bold leading-tight sm:text-5xl">Want to know more about my experience?</h2>
                <p className="mt-4 max-w-lg text-muted sm:text-lg">My resume covers my education, training, projects and the stack I work in. It opens in a new tab, or you can keep a PDF copy.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={site.resumePath} target="_blank" rel="noopener noreferrer" className="btn-primary"><Eye size={16} aria-hidden="true" /> View Resume</a>
                  <a href={site.resumePath} download={site.resumeFileName} className="btn-ghost"><Download size={16} aria-hidden="true" /> Download Resume</a>
                  <button type="button" onClick={() => go('contact')} className="btn-ghost"><MessageCircle size={16} aria-hidden="true" /> Email me</button>
                </div>
              </div>

              <div className="hidden justify-center md:flex" style={{ perspective: 1000 }}>
                <TiltCard max={12} className="w-56">
                  <div aria-hidden="true" className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
                    <div className="h-3 w-24 rounded bg-slate-800" />
                    <div className="mt-1.5 h-2 w-16 rounded bg-cyan-600" />
                    <div className="mt-5 space-y-1.5">{[100, 92, 96, 70].map((w, i) => <div key={i} className="h-1.5 rounded bg-slate-200" style={{ width: `${w}%` }} />)}</div>
                    <div className="mt-5 h-2 w-14 rounded bg-indigo-500" />
                    <div className="mt-2 space-y-1.5">{[95, 88, 60].map((w, i) => <div key={i} className="h-1.5 rounded bg-slate-200" style={{ width: `${w}%` }} />)}</div>
                    <div className="mt-5 flex flex-wrap gap-1">{['React', 'C#', 'SQL', '.NET'].map((t) => <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-semibold text-slate-600">{t}</span>)}</div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
