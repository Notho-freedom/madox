import { contextBridge, ipcRenderer } from 'electron';

interface DesktopAppInfo {
  appVersion: string;
  isMaximized: boolean;
  platform: string;
}

const appInfo =
  ipcRenderer.sendSync('desktop:get-app-info') as DesktopAppInfo;

contextBridge.exposeInMainWorld('desktop', {
  isDesktop: true,
  platform: appInfo.platform,
  appVersion: appInfo.appVersion,
  openExternal: async (url: string) => {
    await ipcRenderer.invoke('desktop:open-external', url);
  },
  minimizeWindow: async () => {
    await ipcRenderer.invoke('desktop:minimize-window');
  },
  toggleMaximizeWindow: async () => {
    return ipcRenderer.invoke('desktop:toggle-maximize-window') as Promise<boolean>;
  },
  closeWindow: async () => {
    await ipcRenderer.invoke('desktop:close-window');
  },
  isWindowMaximized: () => {
    return appInfo.isMaximized;
  },
  onWindowStateChange: (callback: (isMaximized: boolean) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: { isMaximized: boolean }) => {
      appInfo.isMaximized = payload.isMaximized;
      callback(payload.isMaximized);
    };

    ipcRenderer.on('desktop:window-state-changed', listener);

    return () => {
      ipcRenderer.removeListener('desktop:window-state-changed', listener);
    };
  }
});
