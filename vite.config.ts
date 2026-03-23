import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';

const isDesktopBuild = process.env.VITE_DESKTOP === 'true';
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    ...(isDesktopBuild ?
    [
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            minify: isProduction
          }
        }
      },
      preload: {
        input: 'electron/preload.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            minify: isProduction
          }
        }
      }
    })] :
    [])
  ]
});
