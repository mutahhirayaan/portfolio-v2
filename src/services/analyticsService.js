import axios from 'axios';
import { api } from './api';
import { env } from '../config/env';

/**
 * Visitor counter abstraction. Providers (VITE_VIEW_PROVIDER):
 *   firebase   -> Firestore doc stats/site (needs VITE_FIREBASE_*)
 *   api        -> POST /analytics/visit, GET /analytics/views on your ASP.NET Core API
 *   counterapi -> hosted counter at counterapi.dev (no backend needed)
 *   none       -> counter hidden
 * A visit is counted once per browser session (or once per browser with VITE_COUNT_MODE=unique).
 * The number is never faked: if the provider fails, the counter simply hides.
 */
const COUNTER_KEY = 'portfolio-views';
const SESSION_FLAG = 'pf_visit_counted';
const UNIQUE_FLAG = 'pf_visitor_id';

const safe = {
  get: (store, key) => { try { return store.getItem(key); } catch { return null; } },
  set: (store, key, val) => { try { store.setItem(key, val); } catch { /* ignore */ } },
};

function shouldCountVisit() {
  if (env.countMode === 'unique') return !safe.get(localStorage, UNIQUE_FLAG);
  return !safe.get(sessionStorage, SESSION_FLAG);
}
function markCounted() {
  if (env.countMode === 'unique') safe.set(localStorage, UNIQUE_FLAG, crypto.randomUUID?.() || String(Date.now()));
  else safe.set(sessionStorage, SESSION_FLAG, '1');
}

let cache = null;

async function fetchCount() {
  const count = shouldCountVisit();
  if (env.viewProvider === 'firebase' && env.firebase.enabled) {
    const fb = await import('./firebaseData');
    if (count) { await fb.bumpSiteViews().catch(() => {}); markCounted(); }
    return fb.getSiteViews();
  }
  if (env.viewProvider === 'api' && env.apiEnabled) {
    if (count) {
      const visitorId = safe.get(localStorage, UNIQUE_FLAG) || undefined;
      await api.post('/analytics/visit', { path: window.location.pathname, visitorId }).catch(() => {});
      markCounted();
    }
    const { data } = await api.get('/analytics/views');
    return Number(data?.total ?? data?.count ?? data);
  }
  if (env.viewProvider === 'counterapi') {
    const base = `https://api.counterapi.dev/v1/${encodeURIComponent(env.counterNamespace)}/${COUNTER_KEY}`;
    const { data } = await axios.get(count ? `${base}/up` : base, { timeout: 8000 });
    if (count) markCounted();
    return Number(data?.count);
  }
  return null;
}

export function getViewCount() {
  if (!cache) cache = fetchCount().then((n) => (Number.isFinite(n) ? n : null)).catch(() => null);
  return cache;
}
