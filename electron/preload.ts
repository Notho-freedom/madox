import { contextBridge, ipcRenderer } from 'electron';

interface DesktopAppInfo {
  appVersion: string;
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
  }
});
