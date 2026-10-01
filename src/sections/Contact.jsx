import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin, Send } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import { site } from '../config/site';
import { sendMessage } from '../services/contactService';

const MAX = 500;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!emailRe.test(v.email.trim())) e.email = 'Enter a valid email address.';
  if (v.message.trim().length < 10) e.message = 'Write at least 10 characters.';
  if (v.message.length > MAX) e.message = `Keep it under ${MAX} characters.`;
  return e;
}

const infoCards = [
  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: FaGithub, label: 'GitHub', value: site.github.replace('https://', ''), href: site.github, ext: true },
  { icon: FaLinkedinIn, label: 'LinkedIn', value: 'Mohammad Mutahhir', href: site.linkedin, ext: true },
  { icon: MapPin, label: 'Location', value: site.location },
];

export default function Contact() {
  const [v, setV] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k) => (e) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k) => () => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validate(v)); };

  const submit = async (e) => {
    e.preventDefault();
    if (v.website) return; // honeypot: bots fill this hidden field
    const errs = validate(v);
    setErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length) return;
    setStatus('loading');
    try {
      await sendMessage({ name: v.name.trim(), email: v.email.trim(), subject: v.subject.trim(), message: v.message.trim() });
      setStatus('success');
      setV({ name: '', email: '', subject: '', message: '', website: '' });
      setTouched({});
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-bright/15 blur-[100px]" />
        <div className="animate-drift absolute bottom-[5%] right-[8%] h-80 w-80 rounded-full bg-accent/20 blur-[110px]" style={{ animationDelay: '-7s' }} />
        <div className="grid-bg absolute inset-0 opacity-60" />
      </div>

      <div className="container-x">
        <SectionHeading index="07" kicker="Contact" title={<span id="contact-title">Let's Build Something Great Together.</span>} text="Have a project, an internship or just a question? Send a message and I'll reply by email." />

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <ul className="space-y-4">
            {infoCards.map((c, i) => {
              const inner = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-bright/25 to-accent/25 text-primary ring-1 ring-line/10"><c.icon size={20} aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-muted">{c.label}</span>
                    <span className="block truncate text-sm font-semibold sm:text-base">{c.value}</span>
                  </span>
                </>
              );
              return (
                <li key={c.label}>
                  <Reveal delay={i * 0.07}>
                    {c.href ? (
                      <a href={c.href} {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="glass flex items-center gap-4 rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">{inner}</a>
                    ) : (
                      <div className="glass flex items-center gap-4 rounded-3xl p-4">{inner}</div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <Reveal delay={0.1} style={{ perspective: 1400 }}>
            <TiltCard max={3} glare className="glass-strong rounded-[2rem] p-6 sm:p-8">
              <form onSubmit={submit} noValidate aria-label="Contact form" className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold">Name</label>
                    <input id="c-name" className="field" autoComplete="name" value={v.name} onChange={set('name')} onBlur={blur('name')} aria-invalid={Boolean(touched.name && errors.name)} aria-describedby="e-name" placeholder="Your name" />
                    <p id="e-name" className="mt-1 min-h-[1rem] text-xs text-rose-500">{touched.name && errors.name}</p>
                  </div>
                  <div>
                    <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold">Email</label>
                    <input id="c-email" type="email" className="field" autoComplete="email" value={v.email} onChange={set('email')} onBlur={blur('email')} aria-invalid={Boolean(touched.email && errors.email)} aria-describedby="e-email" placeholder="you@example.com" />
                    <p id="e-email" className="mt-1 min-h-[1rem] text-xs text-rose-500">{touched.email && errors.email}</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="c-subject" className="mb-1.5 block text-sm font-semibold">Subject <span className="font-normal text-muted">(optional)</span></label>
                  <input id="c-subject" className="field" value={v.subject} onChange={set('subject')} placeholder="What is this about?" />
                </div>
                <div>
                  <label htmlFor="c-message" className="mb-1.5 block text-sm font-semibold">Message</label>
                  <textarea id="c-message" rows={5} maxLength={MAX + 50} className="field resize-none" value={v.message} onChange={set('message')} onBlur={blur('message')} aria-invalid={Boolean(touched.message && errors.message)} aria-describedby="e-message" placeholder="Tell me about your project..." />
                  <div className="mt-1 flex justify-between text-xs">
                    <p id="e-message" className="min-h-[1rem] text-rose-500">{touched.message && errors.message}</p>
                    <span className={v.message.length > MAX ? 'text-rose-500' : 'text-muted'}>{v.message.length}/{MAX}</span>
                  </div>
                </div>

                {/* Honeypot: hidden from people, visible to bots */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} /></label>
                </div>

                <motion.button type="submit" disabled={status === 'loading'} whileTap={{ scale: 0.97 }} className="btn-primary w-full disabled:opacity-70 sm:w-auto">
                  {status === 'loading' ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending...</> : <><Send size={16} aria-hidden="true" /> Send Message</>}
                </motion.button>

                <div aria-live="polite" role="status">
                  <AnimatePresence mode="wait">
                    {status === 'success' && (
                      <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 rounded-2xl bg-emerald-500/10 p-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> Message sent. Thanks for reaching out, I'll reply soon.
                      </motion.p>
                    )}
                    {status === 'error' && (
                      <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 rounded-2xl bg-rose-500/10 p-3 text-sm font-medium text-rose-600 dark:text-rose-400">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span>{errorMsg} You can also email me directly at <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
