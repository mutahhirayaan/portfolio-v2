import { configureStore } from '@reduxjs/toolkit';
import theme from './themeSlice';
import auth from './authSlice';

export const store = configureStore({ reducer: { theme, auth } });
