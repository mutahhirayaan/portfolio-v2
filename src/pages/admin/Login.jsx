import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Loader2, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import PageTransition from '../../components/PageTransition';
import Logo from '../../components/Logo';
import { env } from '../../config/env';
import { firebaseLogin, loginSuccess, previewLogin } from '../../store/authSlice';
import { loginWithFirebaseGoogle, loginWithGoogle, loginWithPassword } from '../../services/authService';
import { useSeo } from '../../hooks/useSeo';

export default function Login() {
  useSeo({ title: 'Admin sign in', path: '/admin/login' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, authReady } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dest = location.state?.from || '/admin';

  if (token && user?.roles.includes('Admin')) return <Navigate to={dest} replace />;

  const finish = (jwt) => { dispatch(loginSuccess(jwt)); navigate(dest, { replace: true }); };
  const run = async (fn) => { setBusy(true); setError(''); try { finish(await fn()); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  const runFirebase = async () => {
    setBusy(true); setError('');
    try { dispatch(firebaseLogin(await loginWithFirebaseGoogle())); navigate(dest, { replace: true }); }
    catch (e) { setError(e?.code === 'auth/popup-closed-by-user' ? 'Sign-in popup band ho gaya.' : e.message); }
    finally { setBusy(false); }
  };

  const showPassword = env.apiEnabled;

  return (
    <PageTransition>
      <section className="container-x flex min-h-screen items-center justify-center py-28">
        <div className="glass-strong w-full max-w-md rounded-[2rem] p-8">
          <Logo />
          <h1 className="mt-6 flex items-center gap-2 font-display text-2xl font-bold"><Lock size={20} aria-hidden="true" /> Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Sirf site owner ke liye. Visitors ko sign in nahi karna padta.</p>

          {env.firebase.enabled && (
            <button type="button" onClick={runFirebase} disabled={busy || !authReady} className="btn-ghost mt-6 w-full disabled:opacity-70">
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <FcGoogle size={20} aria-hidden="true" />} Continue with Google
            </button>
          )}

          {showPassword && (
            <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); run(() => loginWithPassword(form.email, form.password)); }}>
              <div>
                <label htmlFor="a-email" className="mb-1.5 block text-sm font-semibold">Email</label>
                <input id="a-email" type="email" required className="field" autoComplete="username" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label htmlFor="a-pass" className="mb-1.5 block text-sm font-semibold">Password</label>
                <input id="a-pass" type="password" required className="field" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-70">{busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : 'Sign in'}</button>
            </form>
          )}

          {error && <p role="alert" className="mt-4 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-500">{error}</p>}
          {!env.firebase.enabled && !showPassword && !env.adminPreview && (
            <p className="mt-6 rounded-xl bg-line/[0.06] p-3 text-sm text-muted">Admin login abhi off hai. `.env` me VITE_FIREBASE_* values bharo.</p>
          )}

          {env.googleClientId && showPassword && (
            <div className="mt-5 flex justify-center">
              <GoogleOAuthProvider clientId={env.googleClientId}>
                <GoogleLogin onSuccess={(r) => run(() => loginWithGoogle(r.credential))} onError={() => setError('Google sign-in was cancelled or failed.')} theme="filled_black" shape="pill" />
              </GoogleOAuthProvider>
            </div>
          )}

          {env.adminPreview && (
            <button type="button" className="btn-ghost mt-5 w-full" onClick={() => { dispatch(previewLogin()); navigate('/admin', { replace: true }); }}>
              Open dashboard preview (dev only)
            </button>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
