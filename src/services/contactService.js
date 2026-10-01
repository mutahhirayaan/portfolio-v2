import emailjs from '@emailjs/browser';
import { api, errorMessage } from './api';
import { env } from '../config/env';
import { site } from '../config/site';

async function notifyViaEmailJs({ name, email, subject, message }) {
  await emailjs.send(
    env.emailjs.serviceId,
    env.emailjs.templateId,
    { from_name: name, from_email: email, reply_to: email, subject: subject || `New message from ${name}`, message, to_email: site.email },
    { publicKey: env.emailjs.publicKey },
  );
}

/**
 * Sends a contact message. Provider order:
 *  1. Firebase Firestore (VITE_FIREBASE_* set)  -> saved in `messages`, visible in the admin dashboard.
 *     If EmailJS is also configured, an email notification is sent too (its failure is ignored).
 *  2. EmailJS only
 *  3. ASP.NET Core API POST /contact
 */
export async function sendMessage(payload) {
  if (env.firebase.enabled) {
    try {
      const { addContactMessage } = await import('./firebaseData');
      await addContactMessage(payload);
    } catch (e) {
      throw new Error(e?.code === 'permission-denied' ? 'Message was blocked by the database rules. Check firestore.rules.' : 'Could not save your message. Please try again.');
    }
    if (env.emailjs.enabled) notifyViaEmailJs(payload).catch(() => {});
    return { ok: true };
  }
  if (env.emailjs.enabled) {
    try { await notifyViaEmailJs(payload); return { ok: true }; }
    catch (e) { throw new Error(e?.text || 'The email service rejected the message.'); }
  }
  if (env.apiEnabled) {
    try { await api.post('/contact', payload); return { ok: true }; }
    catch (e) { throw new Error(errorMessage(e)); }
  }
  throw new Error('The contact form is not connected yet.');
}
