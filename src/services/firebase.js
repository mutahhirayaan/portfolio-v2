import { env } from '../config/env';

// Firebase is loaded lazily (dynamic import) so visitors who never trigger it don't download the SDK up front.
let appPromise = null;

export function getFirebase() {
  if (!env.firebase.enabled) return Promise.reject(new Error('Firebase is not configured. Fill the VITE_FIREBASE_* values in .env'));
  if (!appPromise) {
    appPromise = (async () => {
      const [{ initializeApp }, { getFirestore }] = await Promise.all([import('firebase/app'), import('firebase/firestore')]);
      const app = initializeApp(env.firebase.config);
      return { app, db: getFirestore(app) };
    })();
  }
  return appPromise;
}

export async function getFirebaseAuth() {
  const { app } = await getFirebase();
  const m = await import('firebase/auth');
  return { auth: m.getAuth(app), GoogleAuthProvider: m.GoogleAuthProvider, signInWithPopup: m.signInWithPopup, signOut: m.signOut, onAuthStateChanged: m.onAuthStateChanged };
}
