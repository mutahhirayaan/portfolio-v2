import { api, errorMessage } from './api';
import { env } from '../config/env';
import { getFirebaseAuth } from './firebase';

// Expected API response: { token: "<jwt>" }  (JWT must contain a role claim, e.g. "Admin")
export async function loginWithPassword(email, password) {
  if (!env.apiEnabled) throw new Error('API is not configured. Set VITE_API_BASE_URL.');
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return data.token;
  } catch (e) {
    throw new Error(errorMessage(e, 'Login failed. Check your credentials.'));
  }
}

// Send the Google ID token (credential) to your API; it verifies it and returns your own JWT.
export async function loginWithGoogle(credential) {
  if (!env.apiEnabled) throw new Error('API is not configured. Set VITE_API_BASE_URL.');
  try {
    const { data } = await api.post('/auth/google', { credential });
    return data.token;
  } catch (e) {
    throw new Error(errorMessage(e, 'Google sign-in failed.'));
  }
}

// ---------- Firebase Google sign-in (admin) ----------
// The email check here is only UX. The real protection is the `isAdmin()` rule in firestore.rules.
export const isAdminEmail = (email) => Boolean(email) && email.toLowerCase() === env.adminEmail.toLowerCase();

export async function loginWithFirebaseGoogle() {
  const { auth, GoogleAuthProvider, signInWithPopup, signOut } = await getFirebaseAuth();
  const res = await signInWithPopup(auth, new GoogleAuthProvider());
  if (!isAdminEmail(res.user.email)) {
    await signOut(auth);
    throw new Error('Ye Google account admin nahi hai.');
  }
  return { email: res.user.email, name: res.user.displayName || 'Admin' };
}

export async function signOutFirebase() {
  if (!env.firebase.enabled) return;
  try { const { auth, signOut } = await getFirebaseAuth(); await signOut(auth); } catch { /* ignore */ }
}

export async function watchFirebaseAuth(callback) {
  const { auth, onAuthStateChanged, signOut } = await getFirebaseAuth();
  return onAuthStateChanged(auth, async (user) => {
    if (user && !isAdminEmail(user.email)) { await signOut(auth); callback(null); return; }
    callback(user ? { email: user.email, name: user.displayName || 'Admin' } : null);
  });
}
