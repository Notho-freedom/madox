import { createContext } from 'react';
import { type AppLanguage } from '../services/appSettings';
import { fallbackLanguage } from './messages';

export interface I18nContextValue {
  language: AppLanguage;
  t: (key: string, values?: Record<string, number | string>) => string;
}

export const I18nContext = createContext<I18nContextValue>({
  language: fallbackLanguage,
  t: (key) => key
});
