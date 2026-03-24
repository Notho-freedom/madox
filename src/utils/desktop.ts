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

export async function minimizeDesktopWindow(): Promise<void> {
  if (window.desktop?.minimizeWindow) {
    await window.desktop.minimizeWindow();
  }
}

export async function toggleDesktopWindowMaximize(): Promise<boolean> {
  if (window.desktop?.toggleMaximizeWindow) {
    return window.desktop.toggleMaximizeWindow();
  }

  return false;
}

export async function closeDesktopWindow(): Promise<void> {
  if (window.desktop?.closeWindow) {
    await window.desktop.closeWindow();
  }
}

export function isDesktopWindowMaximized(): boolean {
  return window.desktop?.isWindowMaximized?.() ?? false;
}

export function onDesktopWindowStateChange(
  callback: (isMaximized: boolean) => void
): () => void {
  return (
    window.desktop?.onWindowStateChange?.(callback) ??
    (() => {
      return undefined;
    })
  );
}
