import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { env } from '../config/env';

const KEY = 'pf_admin_token';
const ROLE_URI = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export function parseToken(token) {
  try {
    const p = jwtDecode(token);
    const raw = p.role ?? p[ROLE_URI] ?? [];
    const roles = Array.isArray(raw) ? raw : [raw];
    return { email: p.email || p.sub || '', name: p.name || p.unique_name || 'Admin', roles, exp: p.exp ? p.exp * 1000 : null };
  } catch {
    return null;
  }
}

const load = () => {
  try {
    const token = localStorage.getItem(KEY);
    if (!token) return { token: null, user: null };
    const user = parseToken(token);
    if (!user || (user.exp && user.exp < Date.now())) { localStorage.removeItem(KEY); return { token: null, user: null }; }
    return { token, user };
  } catch { return { token: null, user: null }; }
};

// provider: 'jwt' (ASP.NET API) | 'firebase' | 'preview'
// authReady: false until Firebase has told us whether someone is signed in (only relevant when Firebase is on).
const authSlice = createSlice({
  name: 'auth',
  initialState: { ...load(), preview: false, provider: 'jwt', authReady: !env.firebase.enabled },
  reducers: {
    loginSuccess(state, { payload }) {
      state.token = payload;
      state.user = parseToken(payload);
      state.preview = false;
      state.provider = 'jwt';
      state.authReady = true;
      try { localStorage.setItem(KEY, payload); } catch { /* ignore */ }
    },
    firebaseLogin(state, { payload }) {
      state.token = 'firebase';
      state.user = { email: payload.email, name: payload.name, roles: ['Admin'], exp: null };
      state.provider = 'firebase';
      state.preview = false;
      state.authReady = true;
    },
    firebaseSignedOut(state) {
      if (state.provider === 'firebase') { state.token = null; state.user = null; state.provider = 'jwt'; }
      state.authReady = true;
    },
    previewLogin(state) {
      state.token = 'preview';
      state.user = { email: 'preview@local', name: 'Preview admin', roles: ['Admin'], exp: null };
      state.preview = true;
      state.provider = 'preview';
      state.authReady = true;
    },
    logout(state) {
      state.token = null; state.user = null; state.preview = false; state.provider = 'jwt';
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    },
  },
});

export const { loginSuccess, firebaseLogin, firebaseSignedOut, previewLogin, logout } = authSlice.actions;
export default authSlice.reducer;
