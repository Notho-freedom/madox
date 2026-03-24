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
    <div className="app-drag fixed right-3 top-3 z-[160] flex items-center gap-1 rounded-full bg-[#08080f]/72 p-1.5 shadow-[0_12px_28px_rgba(5,10,18,0.42)] backdrop-blur-xl">
      <button
        type="button"
        aria-label="Minimize window"
        className="app-no-drag flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/8 hover:text-white"
        onClick={() => {
          void minimizeDesktopWindow();
        }}>
        <Minus size={16} />
      </button>

      <button
        type="button"
        aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
        className="app-no-drag flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/8 hover:text-white"
        onClick={async () => {
          const nextIsMaximized = await toggleDesktopWindowMaximize();
          setIsMaximized(nextIsMaximized);
        }}>
        {isMaximized ?
          <Copy size={14} className="-translate-y-[1px]" /> :
          <Square size={14} />}
      </button>

      <button
        type="button"
        aria-label="Close window"
        className="app-no-drag flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-500/18 hover:text-red-300"
        onClick={() => {
          void closeDesktopWindow();
        }}>
        <X size={16} />
      </button>
    </div>
  );
}
