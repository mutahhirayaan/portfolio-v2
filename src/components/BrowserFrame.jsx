import { cn } from '../utils/cn';

export default function BrowserFrame({ src, alt, url = 'localhost', className, imgClassName, priority = false }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-line/15 bg-elevated shadow-soft', className)}>
      <div className="flex items-center gap-2 border-b border-line/10 bg-line/[0.05] px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <span className="mx-auto max-w-[60%] flex-1 truncate rounded-full bg-line/[0.07] px-3 py-0.5 text-center font-mono text-[10px] text-muted">{url}</span>
        <span className="w-10" aria-hidden="true" />
      </div>
      <div className="aspect-[16/10] overflow-hidden bg-line/[0.04]">
        <img
          src={src}
          alt={alt}
          width="1280"
          height="800"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn('h-full w-full object-cover object-top', imgClassName)}
        />
      </div>
    </div>
  );
}
