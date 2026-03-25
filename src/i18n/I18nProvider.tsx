import React, { useEffect, useMemo, useState } from 'react';
import {
  getAppSettings,
  subscribeAppSettings,
  type AppLanguage
} from '../services/appSettings';
import { I18nContext, type I18nContextValue } from './context';
import { fallbackLanguage, messages, type TranslationDictionary } from './messages';

function readNestedValue(
  dictionary: TranslationDictionary,
  key: string
): string | null {
  const value = key.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') {
      return null;
    }

    return (current as Record<string, unknown>)[segment] ?? null;
  }, dictionary);

  return typeof value === 'string' ? value : null;
}

function interpolate(template: string, values?: Record<string, number | string>) {
  if (!values) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_match, token) => {
    const value = values[token];
    return value === undefined ? '' : String(value);
  });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(fallbackLanguage);

  useEffect(() => {
    let active = true;

    const syncLanguage = async () => {
      const settings = await getAppSettings();
      if (active) {
        setLanguage(settings.language);
      }
    };

    void syncLanguage();

    const unsubscribe = subscribeAppSettings(() => {
      void syncLanguage();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      t: (key, values) => {
        const dictionary = messages[language] ?? messages[fallbackLanguage];
        const fallbackDictionary = messages[fallbackLanguage];
        const resolved =
          readNestedValue(dictionary, key) ??
          readNestedValue(fallbackDictionary, key) ??
          key;

        return interpolate(resolved, values);
      }
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
