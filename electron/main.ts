import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, ipcMain, shell } from 'electron';

const APP_PROTOCOL = 'file:';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const RENDERER_ENTRY = path.join(__dirname, '../dist/index.html');
const PRELOAD_ENTRY = path.join(__dirname, 'preload.mjs');

let mainWindow: BrowserWindow | null = null;

function getWindowState(win: BrowserWindow | null) {
  return {
    isMaximized: win?.isMaximized() ?? false
  };
}

function emitWindowState(win: BrowserWindow | null) {
  if (!win || win.isDestroyed()) {
    return;
  }

  win.webContents.send('desktop:window-state-changed', getWindowState(win));
}

function isSafeExternalUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function isAppNavigation(url: string): boolean {
  if (DEV_SERVER_URL && url.startsWith(DEV_SERVER_URL)) {
    return true;
  }

  return url.startsWith(APP_PROTOCOL);
}

function registerIpc() {
  ipcMain.on('desktop:get-app-info', (event) => {
    const senderWindow = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;

    event.returnValue = {
      appVersion: app.getVersion(),
      isMaximized: getWindowState(senderWindow).isMaximized,
      platform: process.platform
    };
  });

  ipcMain.handle('desktop:open-external', async (_event, rawUrl: string) => {
    if (!isSafeExternalUrl(rawUrl)) {
      throw new Error('Unsupported external URL.');
    }

    await shell.openExternal(rawUrl);
  });

  ipcMain.handle('desktop:minimize-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;
    win?.minimize();
  });

  ipcMain.handle('desktop:toggle-maximize-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;

    if (!win) {
      return false;
    }

    if (win.isMaximized()) {
      win.unmaximize();
      return false;
    }

    win.maximize();
    return true;
  });

  ipcMain.handle('desktop:close-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;
    win?.close();
  });

  ipcMain.handle('desktop:is-window-maximized', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;
    return getWindowState(win).isMaximized;
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1120,
    minHeight: 720,
    backgroundColor: '#08080f',
    autoHideMenuBar: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: PRELOAD_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      void shell.openExternal(url);
    }

    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isAppNavigation(url)) {
      return;
    }

    event.preventDefault();

    if (isSafeExternalUrl(url)) {
      void shell.openExternal(url);
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    emitWindowState(mainWindow);
  });

  mainWindow.on('maximize', () => {
    emitWindowState(mainWindow);
  });

  mainWindow.on('unmaximize', () => {
    emitWindowState(mainWindow);
  });

  if (DEV_SERVER_URL) {
    await mainWindow.loadURL(DEV_SERVER_URL);
    return;
  }

  await mainWindow.loadFile(RENDERER_ENTRY);
}

app.whenReady().then(async () => {
  registerIpc();
  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
