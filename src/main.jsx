import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/manrope';
import '@fontsource-variable/jetbrains-mono';
import './styles/index.css';
import App from './App';
import { store } from './store';
import { logout } from './store/authSlice';
import { configureApi } from './services/api';

configureApi({
  tokenProvider: () => store.getState().auth.token,
  unauthorizedHandler: () => store.dispatch(logout()),
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
