import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Download, FolderGit2, MessageCircle } from 'lucide-react';
import HeroBackdrop from '../components/HeroBackdrop';
import ProfileCard from '../components/ProfileCard';
import SocialLinks from '../components/SocialLinks';
import SplitText from '../components/SplitText';
import ViewCounter from '../components/ViewCounter';
import { site } from '../config/site';
import { useScrollToSection } from '../hooks/useScrollToSection';

const Hl = ({ children }) => <strong className="font-semibold text-gradient">{children}</strong>;

export default function Hero() {
  const go = useScrollToSection();
  const reduce = useReducedMotion();
  const fade = (d) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.6, ease: [0.22, 1, 0.36, 1] } });

  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center pb-16 pt-32 sm:pt-36">
      <HeroBackdrop />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <motion.p {...fade(0.1)} className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-bright shadow-[0_0_10px_rgb(var(--bright))]" aria-hidden="true" />
            FULL STACK WEB DEVELOPER
          </motion.p>

          <h1 id="hero-title" className="font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            <SplitText text={`Hi, I'm ${site.name}`} delay={0.2} />
            <br />
            <SplitText text="Building Modern Web Experiences." className="text-gradient" delay={0.55} />
          </h1>

          <motion.p {...fade(1.1)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            I build scalable, responsive and interactive web applications using modern <Hl>Full Stack</Hl> technologies:{' '}
            <Hl>React</Hl> frontends, robust <Hl>ASP.NET Core</Hl> APIs, databases, authentication systems and real-time communication.
          </motion.p>

          <motion.div {...fade(1.25)} className="mt-8 flex flex-wrap items-center gap-3">
            <a href={site.resumePath} download={site.resumeFileName} className="btn-primary">
              <Download size={16} aria-hidden="true" /> Download Resume
            </a>
            <button type="button" onClick={() => go('projects')} className="btn-ghost"><FolderGit2 size={16} aria-hidden="true" /> View Projects</button>
            <button type="button" onClick={() => go('contact')} className="btn-ghost"><MessageCircle size={16} aria-hidden="true" /> Contact Me</button>
          </motion.div>

          <motion.div {...fade(1.4)} className="mt-8 flex flex-wrap items-center gap-4">
            <SocialLinks emailMode="scroll" />
            <ViewCounter />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92, rotateY: -12 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 70, damping: 16 }}
          style={{ perspective: 1200 }}
        >
          <ProfileCard />
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => go('about')}
        aria-label="Scroll to About section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted transition-colors hover:text-fg lg:block"
      >
        <ArrowDown size={20} className="animate-float" />
      </button>
    </section>
  );
}
