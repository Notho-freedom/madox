import React, { useEffect, useState } from 'react';
import { Copy, Minus, Square, X } from 'lucide-react';
import {
  closeDesktopWindow,
  isDesktopApp,
  isDesktopWindowMaximized,
  minimizeDesktopWindow,
  onDesktopWindowStateChange,
  toggleDesktopWindowMaximize
} from '../utils/desktop';

export function DesktopWindowControls() {
  const [isMaximized, setIsMaximized] = useState(() =>
    isDesktopWindowMaximized()
  );

  useEffect(() => {
    if (!isDesktopApp()) {
      return undefined;
    }

    setIsMaximized(isDesktopWindowMaximized());

    return onDesktopWindowStateChange((nextIsMaximized) => {
      setIsMaximized(nextIsMaximized);
    });
  }, []);

  if (!isDesktopApp()) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[60] hidden md:block">
      <div className="app-drag h-10 bg-gradient-to-b from-[#0b0c13]/58 via-[#0b0c13]/38 to-transparent backdrop-blur-xl" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-10 items-center justify-end px-3">
        <div className="app-no-drag pointer-events-auto flex h-8 items-center gap-0.5 rounded-full bg-[#090a10]/56 px-1.5 shadow-[0_12px_32px_rgba(4,8,15,0.28)] backdrop-blur-xl">
          <button
            type="button"
            aria-label="Minimize window"
            className="flex h-6 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              void minimizeDesktopWindow();
            }}>
            <Minus size={14} />
          </button>

          <button
            type="button"
            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
            className="flex h-6 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/8 hover:text-white"
            onClick={async () => {
              const nextIsMaximized = await toggleDesktopWindowMaximize();
              setIsMaximized(nextIsMaximized);
            }}>
            {isMaximized ?
              <Copy size={12} className="-translate-y-[1px]" /> :
              <Square size={12} />}
          </button>

          <button
            type="button"
            aria-label="Close window"
            className="flex h-6 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-500/18 hover:text-red-300"
            onClick={() => {
              void closeDesktopWindow();
            }}>
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
