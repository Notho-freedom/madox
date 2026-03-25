import { useCallback, useEffect, useState } from 'react';
import {
  getAppSettings,
  subscribeAppSettings,
  updateAppSettings,
  type AppSettings
} from '../services/appSettings';

interface UseAppSettingsResult {
  loading: boolean;
  settings: AppSettings | null;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
}

export function useAppSettings(): UseAppSettingsResult {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    setLoading(true);

    try {
      setSettings(await getAppSettings());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  useEffect(() => {
    return subscribeAppSettings(() => {
      void refreshSettings();
    });
  }, [refreshSettings]);

  const handleUpdateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    const nextSettings = await updateAppSettings(updates);
    setSettings(nextSettings);
  }, []);

  return {
    loading,
    settings,
    updateSettings: handleUpdateSettings
  };
}
