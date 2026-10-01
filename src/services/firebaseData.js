import { getFirebase } from './firebase';
import { projects as staticProjects } from '../data/projects';
import { skills as staticSkills } from '../data/skills';

const fs = () => import('firebase/firestore');

// ---------- public writes ----------
export async function addContactMessage({ name, email, subject, message }) {
  const { db } = await getFirebase();
  const { addDoc, collection, serverTimestamp } = await fs();
  await addDoc(collection(db, 'messages'), { name, email, subject: subject || '', message, createdAt: serverTimestamp() });
}

// setDoc+merge => "create" when the doc is missing (views == 1), "update" otherwise (views == old + 1).
// The Firestore Rules only allow exactly these two shapes.
async function bump(col, id) {
  const { db } = await getFirebase();
  const { doc, setDoc, increment } = await fs();
  await setDoc(doc(db, col, id), { views: increment(1) }, { merge: true });
}
export const bumpSiteViews = () => bump('stats', 'site');
export const bumpProjectViews = (slug) => bump('projectViews', slug);

export async function getSiteViews() {
  const { db } = await getFirebase();
  const { doc, getDoc } = await fs();
  const snap = await getDoc(doc(db, 'stats', 'site'));
  return snap.exists() ? Number(snap.data().views) || 0 : 0;
}

// ---------- admin reads (Rules: admin only) ----------
export async function adminMessages() {
  const { db } = await getFirebase();
  const { collection, getDocs, orderBy, query, limit } = await fs();
  const snap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(100)));
  return snap.docs.map((d) => {
    const data = d.data();
    return { id: d.id, ...data, createdAt: data.createdAt?.toDate?.().toISOString() || null };
  });
}

export async function deleteMessage(id) {
  const { db } = await getFirebase();
  const { deleteDoc, doc } = await fs();
  await deleteDoc(doc(db, 'messages', id));
}

export async function adminStats() {
  const { db } = await getFirebase();
  const { collection, getCountFromServer, getDocs } = await fs();
  const [visitors, msgCount, pv] = await Promise.all([
    getSiteViews().catch(() => null),
    getCountFromServer(collection(db, 'messages')).then((s) => s.data().count).catch(() => null),
    getDocs(collection(db, 'projectViews')).then((s) => s.docs.reduce((n, d) => n + (Number(d.data().views) || 0), 0)).catch(() => null),
  ]);
  return { visitors, projectViews: pv, messages: msgCount, projects: staticProjects.length, skills: staticSkills.length };
}
