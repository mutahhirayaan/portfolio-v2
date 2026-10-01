import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { Mail } from 'lucide-react';
import { site } from '../config/site';
import { useScrollToSection } from '../hooks/useScrollToSection';

/** emailMode="scroll" jumps to the contact form; "mailto" opens the mail client. */
export default function SocialLinks({ emailMode = 'scroll', className = '' }) {
  const go = useScrollToSection();
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a className="icon-btn" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><FaGithub size={18} /></a>
      <a className="icon-btn" href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><FaLinkedinIn size={18} /></a>
      {emailMode === 'scroll' ? (
        <button type="button" className="icon-btn" onClick={() => go('contact')} aria-label="Send me a message"><Mail size={18} /></button>
      ) : (
        <a className="icon-btn" href={`mailto:${site.email}`} aria-label="Email me"><Mail size={18} /></a>
      )}
    </div>
  );
}
