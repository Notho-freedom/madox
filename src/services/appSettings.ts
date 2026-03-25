import { getSettingsRecord, putSettingsRecord } from './localDb';

const APP_SETTINGS_EVENT = 'madox:settings-updated';
const APP_SETTINGS_KEY = 'app-settings';

export type AppLanguage = 'en' | 'fr' | 'es' | 'de';

export interface AppSettings {
  autoplayNextEpisode: boolean;
  emailNotifications: boolean;
  language: AppLanguage;
  newReleasesAlerts: boolean;
  newsletterEnabled: boolean;
  playbackQuality: 'auto' | '1080p' | '4k';
  pushNotifications: boolean;
  recommendationsAlerts: boolean;
  reducedMotion: boolean;
  subtitlesEnabled: boolean;
  watchlistUpdatesAlerts: boolean;
}

export const defaultAppSettings: AppSettings = {
  autoplayNextEpisode: true,
  emailNotifications: true,
  language: 'en',
  newReleasesAlerts: true,
  newsletterEnabled: false,
  playbackQuality: 'auto',
  pushNotifications: true,
  recommendationsAlerts: false,
  reducedMotion: false,
  subtitlesEnabled: true,
  watchlistUpdatesAlerts: true
};

function emitSettingsUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(APP_SETTINGS_EVENT));
}

export async function getAppSettings(): Promise<AppSettings> {
  const record = await getSettingsRecord<Partial<AppSettings>>(APP_SETTINGS_KEY);
  return {
    ...defaultAppSettings,
    ...(record?.value ?? {})
  };
}

export async function updateAppSettings(
  updates: Partial<AppSettings>
): Promise<AppSettings> {
  const nextSettings = {
    ...(await getAppSettings()),
    ...updates
  };

  await putSettingsRecord<AppSettings>({
    key: APP_SETTINGS_KEY,
    updatedAt: Date.now(),
    value: nextSettings
  });

  emitSettingsUpdated();
  return nextSettings;
}

export function subscribeAppSettings(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(APP_SETTINGS_EVENT, listener);
  return () => {
    window.removeEventListener(APP_SETTINGS_EVENT, listener);
  };
}
