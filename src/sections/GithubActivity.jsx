import { useEffect, useState } from 'react';
import { GitFork, Star, Users, BookMarked } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { env } from '../config/env';
import { site } from '../config/site';
import { getFeaturedRepos, getGithubProfile } from '../services/githubService';
import { projects } from '../data/projects';

export default function GithubActivity() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState(null);
  const [chartOk, setChartOk] = useState(true);
  const [failed, setFailed] = useState(false);
  const isDarkHex = () => (document.documentElement.classList.contains('dark') ? '22d3ee' : '0e7490');
  const [hex, setHex] = useState(isDarkHex);

  useEffect(() => {
    let alive = true;
    Promise.all([getGithubProfile(), getFeaturedRepos(6)])
      .then(([p, r]) => { if (alive) { setProfile(p); setRepos(r); } })
      .catch(() => alive && setFailed(true));
    const obs = new MutationObserver(() => setHex(isDarkHex()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { alive = false; obs.disconnect(); };
  }, []);

  if (!env.showGithubActivity) return null;

  const fallbackRepos = projects.map((p) => ({ id: p.id, name: p.title, description: p.description, url: p.github, language: p.technologies[0], stars: null }));
  const list = repos && repos.length ? repos : fallbackRepos;

  return (
    <section id="github" aria-labelledby="gh-title" className="section-pad relative">
      <div className="container-x">
        <SectionHeading index="06" kicker="Open source" title={<span id="gh-title">Development activity.</span>} text="Live from GitHub. If the API is rate-limited you'll see my featured projects instead." />

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="glass-strong rounded-3xl p-6">
            <div className="flex items-center gap-4">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="" width="64" height="64" loading="lazy" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-bright/40" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-line/10"><FaGithub size={28} /></span>
              )}
              <div>
                <p className="font-display text-lg font-bold">{profile?.name || site.name}</p>
                <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">@{env.githubUsername}</a>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: BookMarked, label: 'Repos', v: profile?.repos },
                { icon: Users, label: 'Followers', v: profile?.followers },
                { icon: Users, label: 'Following', v: profile?.following },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-line/[0.06] px-2 py-3">
                  <dd className="font-display text-2xl font-bold">{s.v ?? (failed ? '–' : <span className="skeleton mx-auto block h-6 w-8 rounded" />)}</dd>
                  <dt className="text-xs font-semibold text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full"><FaGithub size={16} aria-hidden="true" /> Follow on GitHub</a>
          </Reveal>

          <Reveal delay={0.08} className="space-y-6">
            {chartOk && (
              <div className="glass rounded-3xl p-5">
                <p className="mb-3 text-sm font-semibold text-muted">Contribution activity</p>
                <div className="overflow-x-auto">
                  <img
                    src={`https://ghchart.rshah.org/${hex}/${env.githubUsername}`}
                    alt={`GitHub contribution chart for ${env.githubUsername}`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setChartOk(false)}
                    className="min-w-[640px] dark:opacity-90"
                  />
                </div>
              </div>
            )}
            <ul className="grid gap-4 sm:grid-cols-2">
              {list.map((r) => (
                <li key={r.id}>
                  <a href={r.url || site.github} target="_blank" rel="noopener noreferrer" className="glass block h-full rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                    <p className="flex items-center gap-2 font-display text-sm font-bold"><BookMarked size={15} className="text-primary" aria-hidden="true" /> {r.name}</p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{r.description || 'No description yet.'}</p>
                    <p className="mt-3 flex items-center gap-4 text-[11px] font-semibold text-muted">
                      {r.language && <span>{r.language}</span>}
                      {r.stars != null && <span className="flex items-center gap-1"><Star size={12} aria-hidden="true" />{r.stars}</span>}
                      {r.forks != null && <span className="flex items-center gap-1"><GitFork size={12} aria-hidden="true" />{r.forks}</span>}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
