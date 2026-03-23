import React from 'react';

interface CrystalMenuTriggerProps {
  className?: string;
  onClick: () => void;
}

export function CrystalMenuTrigger({
  className = '',
  onClick
}: CrystalMenuTriggerProps) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={onClick}
      className={`group relative flex items-center justify-center bg-white/5 border border-white/20 hover:bg-white/10 transition-colors ${className}`}
      style={{
        clipPath:
          'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10 text-xl font-bold text-white tracking-tighter">
        C
      </span>
    </button>
  );
}
