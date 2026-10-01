import Hero from '../sections/Hero';
import TechMarquee from '../components/TechMarquee';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Experience from '../sections/Experience';
import Services from '../sections/Services';
import GithubActivity from '../sections/GithubActivity';
import Resume from '../sections/Resume';
import Contact from '../sections/Contact';
import PageTransition from '../components/PageTransition';
import { useSeo } from '../hooks/useSeo';

export default function Home() {
  useSeo({ path: '/' });
  return (
    <PageTransition>
      <Hero />
      <TechMarquee />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <GithubActivity />
      <Resume />
      <Contact />
    </PageTransition>
  );
}
