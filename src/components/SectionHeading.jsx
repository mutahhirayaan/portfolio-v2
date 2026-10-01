import Reveal from './Reveal';
import { cn } from '../utils/cn';

export default function SectionHeading({ index, kicker, title, text, align = 'left', className }) {
  return (
    <Reveal className={cn('mb-12 max-w-2xl sm:mb-16', align === 'center' && 'mx-auto text-center', className)}>
      <p className={cn('mb-3 flex items-center gap-3 text-sm font-semibold text-primary', align === 'center' && 'justify-center')}>
        {index && <span className="font-mono text-xs opacity-80">{index}</span>}
        <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
        <span>{kicker}</span>
      </p>
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{text}</p>}
    </Reveal>
  );
}
