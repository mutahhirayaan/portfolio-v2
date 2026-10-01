import axios from 'axios';
import { env } from '../config/env';

// One axios instance for the whole app. The base URL comes from VITE_API_BASE_URL only.
export const api = axios.create({
  baseURL: env.apiBaseUrl || undefined,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let getToken = () => null;
let onUnauthorized = () => {};

// Wired from main.jsx so this file never imports the store (avoids circular imports).
export function configureApi({ tokenProvider, unauthorizedHandler }) {
  getToken = tokenProvider;
  onUnauthorized = unauthorizedHandler;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && token !== 'preview' && token !== 'firebase') config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) onUnauthorized();
    return Promise.reject(error);
  },
);

export const errorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.message || error?.response?.data?.title || error?.message || fallback;
