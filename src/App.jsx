import { lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import { env } from './config/env';
import { firebaseLogin, firebaseSignedOut } from './store/authSlice';
import { watchFirebaseAuth } from './services/authService';

// Code splitting: heavy or rarely visited pages load on demand.
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

function ThemeSync() {
  const mode = useSelector((s) => s.theme.mode);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.style.colorScheme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#060b18' : '#f4f8ff');
    try { localStorage.setItem('theme', mode); } catch { /* storage unavailable */ }
  }, [mode]);
  return null;
}

// Restores the Firebase admin session, only on /admin routes (so normal visitors never load Firebase Auth).
function AuthBootstrap() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const onAdmin = pathname.startsWith('/admin');
  useEffect(() => {
    if (!env.firebase.enabled || !onAdmin) return undefined;
    let alive = true;
    let unsubscribe = () => {};
    watchFirebaseAuth((user) => dispatch(user ? firebaseLogin(user) : firebaseSignedOut()))
      .then((off) => { if (alive) unsubscribe = off; else off(); })
      .catch(() => dispatch(firebaseSignedOut()));
    return () => { alive = false; unsubscribe(); };
  }, [onAdmin, dispatch]);
  return null;
}

export default function App() {
  return (
    <>
      <ThemeSync />
      <AuthBootstrap />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="projects/:slug" element={<ProjectDetails />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
