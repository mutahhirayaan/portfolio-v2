// Central place for environment variables. Nothing here is a secret:
// every VITE_* value is bundled into the client, so never put private keys in .env.
// (Firebase web config values are public by design; Firestore Rules protect your data.)
import { site } from './site';

const bool = (v, d = false) => (v === undefined || v === '' ? d : String(v).toLowerCase() === 'true');
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};
const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

export const env = {
  apiBaseUrl,
  apiEnabled: Boolean(apiBaseUrl),
  firebase: { enabled: firebaseEnabled, config: firebaseConfig },
  adminEmail: (import.meta.env.VITE_ADMIN_EMAIL || site.email).trim(),
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  },
  // firebase | api | counterapi | none  (defaults to firebase when Firebase is configured)
  viewProvider: import.meta.env.VITE_VIEW_PROVIDER || (firebaseEnabled ? 'firebase' : 'counterapi'),
  counterNamespace: import.meta.env.VITE_COUNTER_NAMESPACE || 'mutahhir-portfolio',
  countMode: import.meta.env.VITE_COUNT_MODE || 'session', // session | unique
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME || 'mutahhirayaan',
  showGithubActivity: bool(import.meta.env.VITE_SHOW_GITHUB_ACTIVITY, true),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  adminPreview: import.meta.env.DEV && bool(import.meta.env.VITE_ADMIN_PREVIEW, false),
  siteUrl: (import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/+$/, ''),
};

env.emailjs.enabled = Boolean(env.emailjs.serviceId && env.emailjs.templateId && env.emailjs.publicKey);
