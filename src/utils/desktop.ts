export function isDesktopApp(): boolean {
  return window.desktop?.isDesktop === true;
}

export async function openExternal(url: string): Promise<void> {
  if (window.desktop?.openExternal) {
    await window.desktop.openExternal(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function getDesktopRuntimeInfo() {
  return {
    isDesktop: isDesktopApp(),
    platform: window.desktop?.platform ?? 'web',
    appVersion: window.desktop?.appVersion ?? 'web'
  };
}
