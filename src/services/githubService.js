import axios from 'axios';
import { env } from '../config/env';

// Unauthenticated public GitHub API (60 requests/hour per IP). Results cached for 30 minutes in sessionStorage.
const TTL = 30 * 60 * 1000;

async function cached(key, loader) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const { t, v } = JSON.parse(raw);
      if (Date.now() - t < TTL) return v;
    }
  } catch { /* ignore */ }
  const v = await loader();
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch { /* ignore */ }
  return v;
}

export function getGithubProfile() {
  const u = env.githubUsername;
  return cached(`gh_profile_${u}`, async () => {
    const { data } = await axios.get(`https://api.github.com/users/${u}`, { timeout: 8000 });
    return {
      login: data.login, name: data.name, avatar: data.avatar_url, url: data.html_url,
      repos: data.public_repos, followers: data.followers, following: data.following, bio: data.bio,
    };
  });
}

export function getFeaturedRepos(limit = 6) {
  const u = env.githubUsername;
  return cached(`gh_repos_${u}`, async () => {
    const { data } = await axios.get(`https://api.github.com/users/${u}/repos`, { params: { sort: 'updated', per_page: 30 }, timeout: 8000 });
    return data
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, limit)
      .map((r) => ({ id: r.id, name: r.name, description: r.description, url: r.html_url, language: r.language, stars: r.stargazers_count, forks: r.forks_count }));
  });
}
