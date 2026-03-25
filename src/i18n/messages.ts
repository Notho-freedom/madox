import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import { type AppLanguage } from '../services/appSettings';

export const fallbackLanguage: AppLanguage = 'en';
export const messages = {
  de,
  en,
  es,
  fr
} as const satisfies Record<AppLanguage, typeof en>;

export type TranslationDictionary = typeof en;
