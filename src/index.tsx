import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { App } from './App';
import { I18nProvider } from './i18n/I18nProvider';
import './index.css';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN?.trim();

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.DEV ? 0.15 : 0.05
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
