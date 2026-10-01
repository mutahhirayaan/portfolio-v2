import { Fragment } from 'react';
import { TechIcon } from '../utils/techIcons';
import { marqueeTech } from '../data/skills';

function Row({ hidden }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marqueeTech.map((t) => (
        <Fragment key={t.icon}>
          <li className="flex items-center gap-3 px-6 text-lg font-semibold text-muted sm:px-8 sm:text-xl">
            <TechIcon name={t.icon} size={26} />
            <span className="whitespace-nowrap font-display">{t.name}</span>
          </li>
          <li aria-hidden="true" className="text-bright/60">•</li>
        </Fragment>
      ))}
    </ul>
  );
}

export default function TechMarquee() {
  return (
    <div className="marquee marquee-mask relative overflow-hidden border-y border-line/10 py-6" role="region" aria-label="Technologies I use" tabIndex={0}>
      <div className="marquee-track flex w-max animate-marquee">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
