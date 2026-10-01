import { api } from './api';
import { env } from '../config/env';
import { projects as staticProjects, getProjectBySlug } from '../data/projects';

// Static data is the source of truth until the API is connected.
// When VITE_API_BASE_URL is set, GET /projects is used and falls back to static data on failure.
export async function getProjects() {
  if (!env.apiEnabled) return staticProjects;
  try {
    const { data } = await api.get('/projects');
    return Array.isArray(data) && data.length ? data : staticProjects;
  } catch {
    return staticProjects;
  }
}

export async function getProject(slug) {
  if (!env.apiEnabled) return getProjectBySlug(slug) || null;
  try {
    const { data } = await api.get(`/projects/${encodeURIComponent(slug)}`);
    return data;
  } catch {
    return getProjectBySlug(slug) || null;
  }
}

// Fire-and-forget project view tracking.
export function trackProjectView(slug) {
  const flag = `pf_pv_${slug}`;
  try { if (sessionStorage.getItem(flag)) return; sessionStorage.setItem(flag, '1'); } catch { /* ignore */ }
  if (env.firebase.enabled) {
    import('./firebaseData').then((m) => m.bumpProjectViews(slug)).catch(() => {});
    return;
  }
  if (env.apiEnabled) api.post(`/analytics/project-view`, { slug }).catch(() => {});
}
