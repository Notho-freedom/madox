import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Laptop,
  Lock,
  Monitor,
  Settings,
  Shield,
  Smartphone,
  Subtitles,
  User,
  Volume2
} from 'lucide-react';
import {
  FacetButton,
  FacetField,
  FacetPanel,
  FacetTextarea,
  FacetToggle
} from '../components/design';
import { useAppSettings } from '../hooks/useAppSettings';
import { useI18n } from '../i18n/useI18n';
import { type AppLanguage, type AppSettings } from '../services/appSettings';

type SettingsSectionId =
  | 'display'
  | 'notifications'
  | 'profile'
  | 'security'
  | 'subscription';

function ProfileSection() {
  const { t } = useI18n();

  return (
    <FacetPanel contentClassName="p-8" shape="panelWide">
      <h2 className="mb-6 text-2xl font-bold text-white font-['Advent_Pro']">
        {t('settings.profile.title')}
      </h2>

      <div className="mb-8 flex items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 p-[2px]">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
            alt="Profile"
            className="h-full w-full rounded-full border-4 border-[#08080f] object-cover"
          />
        </div>
        <div>
          <FacetButton className="mb-2" shape="buttonCut10" size="sm" variant="ghost">
            {t('settings.profile.changeAvatar')}
          </FacetButton>
          <p className="text-xs text-gray-500">{t('settings.profile.uploadHint')}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FacetField
            defaultValue="Alex"
            label={t('settings.profile.firstName')}
            type="text"
          />
          <FacetField
            defaultValue="Chen"
            label={t('settings.profile.lastName')}
            type="text"
          />
        </div>
        <FacetField
          defaultValue="alex.chen@example.com"
          label={t('settings.profile.emailAddress')}
          type="email"
        />
        <FacetTextarea
          defaultValue="Cinephile. Sci-fi enthusiast. Always looking for the next great story."
          label={t('settings.profile.bio')}
          rows={3}
        />
      </div>

      <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-8">
        <button className="px-6 py-2 text-sm uppercase tracking-widest text-gray-400 transition-colors hover:text-white">
          {t('common.cancel')}
        </button>
        <FacetButton shape="buttonCut10" size="sm" variant="solid">
          {t('common.saveChanges')}
        </FacetButton>
      </div>
    </FacetPanel>
  );
}

function SecuritySection() {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="space-y-8">
      <FacetPanel contentClassName="p-8" shape="panelWide">
        <h2 className="mb-6 text-2xl font-bold text-white font-['Advent_Pro']">
          {t('settings.security.changePassword')}
        </h2>
        <div className="space-y-6">
          <FacetField
            defaultValue="••••••••••"
            label={t('settings.security.currentPassword')}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-gray-500 transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            type={showPassword ? 'text' : 'password'}
          />
          <div className="grid grid-cols-2 gap-6">
            <FacetField
              label={t('settings.security.newPassword')}
              placeholder={t('settings.security.newPasswordPlaceholder')}
              type="password"
            />
            <FacetField
              label={t('settings.security.confirmPassword')}
              placeholder={t('settings.security.confirmPassword')}
              type="password"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <FacetButton shape="buttonCut10" size="sm" variant="solid">
            {t('settings.security.updatePassword')}
          </FacetButton>
        </div>
      </FacetPanel>

      <FacetPanel contentClassName="p-8" shape="panelWide">
        <h2 className="mb-6 text-2xl font-bold text-white font-['Advent_Pro']">
          {t('settings.security.securityOptions')}
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 py-3">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-cyan-400" />
              <div>
                <div className="font-medium text-white">
                  {t('settings.security.twoFactorAuthentication')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('settings.security.twoFactorDescription')}
                </div>
              </div>
            </div>
            <FacetToggle enabled={twoFactor} onToggle={() => setTwoFactor((current) => !current)} />
          </div>
          <div className="flex items-center justify-between border-b border-white/5 py-3">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-cyan-400" />
              <div>
                <div className="font-medium text-white">
                  {t('settings.security.loginAlerts')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('settings.security.loginAlertsDescription')}
                </div>
              </div>
            </div>
            <FacetToggle
              enabled={loginAlerts}
              onToggle={() => setLoginAlerts((current) => !current)}
            />
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="mb-4 text-sm uppercase tracking-widest text-gray-500">
            {t('settings.security.activeSessions')}
          </h3>
          <div className="space-y-3">
            {[
              {
                current: true,
                device: 'MacBook Pro',
                location: 'Paris, France'
              },
              {
                current: false,
                device: 'iPhone 15',
                location: 'Paris, France'
              }
            ].map((session, index) => (
              <div
                key={session.device}
                className="flex items-center justify-between rounded border border-white/5 bg-black/20 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {index === 0 ? (
                    <Laptop size={18} className="text-gray-400" />
                  ) : (
                    <Smartphone size={18} className="text-gray-400" />
                  )}
                  <div>
                    <div className="text-sm text-white">{session.device}</div>
                    <div className="text-xs text-gray-500">{session.location}</div>
                  </div>
                </div>
                {session.current ? (
                  <span className="text-xs uppercase tracking-widest text-cyan-400">
                    {t('settings.security.current')}
                  </span>
                ) : (
                  <button className="text-xs uppercase tracking-widest text-red-400 transition-colors hover:text-red-300">
                    {t('settings.security.revoke')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </FacetPanel>
    </div>
  );
}

function SubscriptionSection() {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      <FacetPanel contentClassName="p-8" shape="panelWide">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white font-['Advent_Pro']">
            {t('settings.subscription.currentPlan')}
          </h2>
          <span className="prism-border bg-cyan-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300">
            Premium
          </span>
        </div>

        <div className="mb-6 flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white font-['Advent_Pro']">$14.99</span>
          <span className="text-sm text-gray-500">/month</span>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          {[
            '4K Ultra HD',
            'Multiple Devices',
            'Offline Downloads',
            'No Ads',
            'Early Access',
            'Dolby Atmos'
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-cyan-400" />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-500">
              {t('settings.subscription.nextBillingDate')}
            </div>
            <div className="text-white">April 23, 2026</div>
          </div>
          <FacetButton shape="buttonCut10" size="sm" variant="ghost">
            {t('settings.subscription.managePlan')}
          </FacetButton>
        </div>
      </FacetPanel>

      <FacetPanel contentClassName="p-8" shape="panelWide">
        <h2 className="mb-6 text-2xl font-bold text-white font-['Advent_Pro']">
          {t('settings.subscription.paymentMethod')}
        </h2>
        <div className="mb-4 flex items-center gap-4 rounded border border-white/5 bg-black/20 p-4">
          <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-400 text-xs font-bold text-white">
            VISA
          </div>
          <div>
            <div className="text-sm text-white">•••• •••• •••• 4829</div>
            <div className="text-xs text-gray-500">Expires 08/2027</div>
          </div>
          <button className="ml-auto text-xs uppercase tracking-widest text-cyan-400 transition-colors hover:text-cyan-300">
            {t('settings.subscription.edit')}
          </button>
        </div>
        <button className="text-sm uppercase tracking-widest text-gray-400 transition-colors hover:text-white">
          {t('settings.subscription.addPaymentMethod')}
        </button>
      </FacetPanel>
    </div>
  );
}

function NotificationsSection({
  settings,
  updateSettings
}: {
  settings: AppSettings | null;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
}) {
  const { t } = useI18n();

  const channelItems = useMemo(
    () => [
      {
        descriptionKey: 'settings.notifications.emailDescription',
        enabled: settings?.emailNotifications ?? false,
        labelKey: 'settings.notifications.emailNotifications',
        settingKey: 'emailNotifications' as const
      },
      {
        descriptionKey: 'settings.notifications.pushDescription',
        enabled: settings?.pushNotifications ?? false,
        labelKey: 'settings.notifications.pushNotifications',
        settingKey: 'pushNotifications' as const
      }
    ],
    [settings]
  );

  const alertItems = useMemo(
    () => [
      {
        descriptionKey: 'settings.notifications.newReleasesDescription',
        enabled: settings?.newReleasesAlerts ?? false,
        labelKey: 'settings.notifications.newReleases',
        settingKey: 'newReleasesAlerts' as const
      },
      {
        descriptionKey: 'settings.notifications.personalizedRecommendationsDescription',
        enabled: settings?.recommendationsAlerts ?? false,
        labelKey: 'settings.notifications.personalizedRecommendations',
        settingKey: 'recommendationsAlerts' as const
      },
      {
        descriptionKey: 'settings.notifications.watchlistUpdatesDescription',
        enabled: settings?.watchlistUpdatesAlerts ?? false,
        labelKey: 'settings.notifications.watchlistUpdates',
        settingKey: 'watchlistUpdatesAlerts' as const
      },
      {
        descriptionKey: 'settings.notifications.weeklyNewsletterDescription',
        enabled: settings?.newsletterEnabled ?? false,
        labelKey: 'settings.notifications.weeklyNewsletter',
        settingKey: 'newsletterEnabled' as const
      }
    ],
    [settings]
  );

  return (
    <FacetPanel contentClassName="p-8" shape="panelWide">
      <h2 className="mb-8 text-2xl font-bold text-white font-['Advent_Pro']">
        {t('settings.notifications.title')}
      </h2>

      <div className="space-y-1">
        <h3 className="mb-4 text-sm uppercase tracking-widest text-gray-500">
          {t('settings.notifications.channels')}
        </h3>
        {channelItems.map((item) => (
          <div
            key={item.settingKey}
            className="flex items-center justify-between border-b border-white/5 py-4"
          >
            <div>
              <div className="font-medium text-white">{t(item.labelKey)}</div>
              <div className="text-xs text-gray-500">{t(item.descriptionKey)}</div>
            </div>
            <FacetToggle
              enabled={item.enabled}
              onToggle={() =>
                void updateSettings({
                  [item.settingKey]: !item.enabled
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-1">
        <h3 className="mb-4 text-sm uppercase tracking-widest text-gray-500">
          {t('settings.notifications.contentAlerts')}
        </h3>
        {alertItems.map((item) => (
          <div
            key={item.settingKey}
            className="flex items-center justify-between border-b border-white/5 py-4"
          >
            <div>
              <div className="font-medium text-white">{t(item.labelKey)}</div>
              <div className="text-xs text-gray-500">{t(item.descriptionKey)}</div>
            </div>
            <FacetToggle
              enabled={item.enabled}
              onToggle={() =>
                void updateSettings({
                  [item.settingKey]: !item.enabled
                })
              }
            />
          </div>
        ))}
      </div>
    </FacetPanel>
  );
}

function DisplaySection({
  settings,
  updateSettings
}: {
  settings: AppSettings | null;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
}) {
  const { t } = useI18n();
  const qualityOptions: AppSettings['playbackQuality'][] = ['auto', '1080p', '4k'];
  const languages: AppLanguage[] = ['en', 'fr', 'es', 'de'];

  if (!settings) {
    return (
      <FacetPanel contentClassName="p-8" shape="panelWide">
        <div className="text-sm uppercase tracking-widest text-gray-500">
          Loading settings...
        </div>
      </FacetPanel>
    );
  }

  return (
    <div className="space-y-8">
      <FacetPanel contentClassName="p-8" shape="panelWide">
        <h2 className="mb-8 text-2xl font-bold text-white font-['Advent_Pro']">
          {t('settings.display.playback')}
        </h2>

        <div className="space-y-8">
          <div>
            <label className="mb-3 block text-xs uppercase tracking-widest text-gray-500">
              {t('settings.display.videoQuality')}
            </label>
            <div className="flex gap-3">
              {qualityOptions.map((option) => (
                <FacetButton
                  key={option}
                  onClick={() => void updateSettings({ playbackQuality: option })}
                  variant={settings.playbackQuality === option ? 'outline' : 'ghost'}
                >
                  {option}
                </FacetButton>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 py-3">
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-cyan-400" />
              <div>
                <div className="font-medium text-white">
                  {t('settings.display.autoplayNextEpisode')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('settings.display.autoplayDescription')}
                </div>
              </div>
            </div>
            <FacetToggle
              enabled={settings.autoplayNextEpisode}
              onToggle={() =>
                void updateSettings({
                  autoplayNextEpisode: !settings.autoplayNextEpisode
                })
              }
            />
          </div>

          <div className="flex items-center justify-between border-b border-white/5 py-3">
            <div className="flex items-center gap-3">
              <Subtitles size={18} className="text-cyan-400" />
              <div>
                <div className="font-medium text-white">{t('settings.display.subtitles')}</div>
                <div className="text-xs text-gray-500">
                  {t('settings.display.subtitlesDescription')}
                </div>
              </div>
            </div>
            <FacetToggle
              enabled={settings.subtitlesEnabled}
              onToggle={() =>
                void updateSettings({
                  subtitlesEnabled: !settings.subtitlesEnabled
                })
              }
            />
          </div>
        </div>
      </FacetPanel>

      <FacetPanel contentClassName="p-8" shape="panelWide">
        <h2 className="mb-8 text-2xl font-bold text-white font-['Advent_Pro']">
          {t('settings.display.interface')}
        </h2>

        <div className="space-y-8">
          <div>
            <label className="mb-3 block text-xs uppercase tracking-widest text-gray-500">
              {t('settings.display.language')}
            </label>
            <div className="flex flex-wrap gap-3">
              {languages.map((language) => (
                <FacetButton
                  key={language}
                  onClick={() => void updateSettings({ language })}
                  variant={settings.language === language ? 'outline' : 'ghost'}
                >
                  {t(`settings.languages.${language}`)}
                </FacetButton>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs uppercase tracking-widest text-gray-500">
              {t('settings.display.theme')}
            </label>
            <div className="flex gap-4">
              <div className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-cyan-500/50 bg-cyan-500/10 p-4">
                <div className="h-8 w-8 rounded border border-white/20 bg-[#08080f]" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {t('settings.theme.darkCrystal')}
                  </div>
                  <div className="text-xs text-cyan-400">{t('settings.theme.active')}</div>
                </div>
              </div>
              <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 opacity-50">
                <div className="h-8 w-8 rounded border border-gray-300 bg-gray-200" />
                <div>
                  <div className="text-sm font-medium text-gray-400">
                    {t('settings.theme.light')}
                  </div>
                  <div className="text-xs text-gray-600">{t('settings.theme.comingSoon')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 py-3">
            <div>
              <div className="font-medium text-white">{t('settings.display.reducedMotion')}</div>
              <div className="text-xs text-gray-500">
                {t('settings.display.reducedMotionDescription')}
              </div>
            </div>
            <FacetToggle
              enabled={settings.reducedMotion}
              onToggle={() =>
                void updateSettings({
                  reducedMotion: !settings.reducedMotion
                })
              }
            />
          </div>
        </div>
      </FacetPanel>
    </div>
  );
}

export function SettingsPage() {
  const { t } = useI18n();
  const { loading, settings, updateSettings } = useAppSettings();
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('profile');

  const sections = [
    { icon: User, id: 'profile', labelKey: 'settings.sections.profile' },
    { icon: Shield, id: 'security', labelKey: 'settings.sections.security' },
    {
      icon: CreditCard,
      id: 'subscription',
      labelKey: 'settings.sections.subscription'
    },
    {
      icon: Bell,
      id: 'notifications',
      labelKey: 'settings.sections.notifications'
    },
    { icon: Monitor, id: 'display', labelKey: 'settings.sections.display' }
  ] as const;

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'notifications':
        return (
          <NotificationsSection settings={settings} updateSettings={updateSettings} />
        );
      case 'display':
        return <DisplaySection settings={settings} updateSettings={updateSettings} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="mx-auto max-w-5xl px-16 py-12 pb-32"
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: -20
      }}
      transition={{
        duration: 0.5
      }}
    >
      <div className="mb-12 flex items-center gap-4 border-b border-white/10 pb-6">
        <Settings size={32} className="text-gray-400" />
        <h1 className="text-4xl font-bold text-white font-['Advent_Pro']">
          {t('settings.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-2">
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                activeSection === item.id
                  ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-300'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm uppercase tracking-widest">{t(item.labelKey)}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSection}-${loading ? 'loading' : 'ready'}`}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              transition={{
                duration: 0.3
              }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
