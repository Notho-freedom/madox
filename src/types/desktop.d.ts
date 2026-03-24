interface DesktopBridge {
  isDesktop: boolean;
  platform: string;
  appVersion: string;
  openExternal: (url: string) => Promise<void>;
  minimizeWindow: () => Promise<void>;
  toggleMaximizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<void>;
  isWindowMaximized: () => boolean;
  onWindowStateChange: (
    callback: (isMaximized: boolean) => void
  ) => () => void;
}

declare global {
  interface Window {
    desktop?: DesktopBridge;
  }
}

export {};
