interface DesktopBridge {
  isDesktop: boolean;
  platform: string;
  appVersion: string;
  openExternal: (url: string) => Promise<void>;
}

declare global {
  interface Window {
    desktop?: DesktopBridge;
  }
}

export {};
