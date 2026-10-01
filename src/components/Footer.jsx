import { Link } from 'react-router-dom';
import Logo from './Logo';
import SocialLinks from './SocialLinks';
import ViewCounter from './ViewCounter';
import { footerLinks, site } from '../config/site';
import { useScrollToSection } from '../hooks/useScrollToSection';

export default function Footer() {
  const go = useScrollToSection();
  return (
    <footer className="relative border-t border-line/10 pb-8 pt-16">
      <div className="container-x grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label="Home"><Logo /></Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            {site.tagline} Full stack developer from {site.location.split(',')[0]}, building with React and ASP.NET Core.
          </p>
          <ViewCounter className="mt-5" />
        </div>
        <nav aria-label="Quick links">
          <h2 className="mb-4 text-sm font-bold">Quick links</h2>
          <ul className="space-y-2.5 text-sm text-muted">
            {footerLinks.map((l) => (
              <li key={l.id}><button type="button" onClick={() => go(l.id)} className="transition-colors hover:text-fg">{l.label}</button></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 text-sm font-bold">Say hello</h2>
          <SocialLinks emailMode="mailto" />
          <a href={`mailto:${site.email}`} className="mt-4 block text-sm text-muted transition-colors hover:text-fg">{site.email}</a>
        </div>
      </div>
      <div className="container-x mt-12 flex flex-col items-center justify-between gap-3 border-t border-line/10 pt-6 text-xs text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <p>Built with React &amp; ASP.NET Core</p>
      </div>
    </footer>
  );
}
