import React from 'react';
import { facetClipPaths } from './tokens';
import { cx } from './utils';

interface FacetPosterCardProps {
  backgroundImage?: string | null;
  children?: React.ReactNode;
  className?: string;
  frameClassName?: string;
  imageLayerClassName?: string;
  fallback?: React.ReactNode;
  hoverOverlay?: React.ReactNode;
  metaOverlay?: React.ReactNode;
  tintColor?: string;
  topOverlay?: React.ReactNode;
}

export function FacetPosterCard({
  backgroundImage,
  children,
  className,
  fallback,
  frameClassName,
  hoverOverlay,
  imageLayerClassName,
  metaOverlay,
  tintColor,
  topOverlay
}: FacetPosterCardProps) {
  return (
    <div className={cx('relative', className)}>
      <div
        className={cx(
          'relative h-[400px] w-full overflow-hidden bg-[#12121a] transition-all duration-500',
          frameClassName
        )}
        style={{
          clipPath: facetClipPaths.card
        }}
      >
        {backgroundImage ? (
          <div
            className={cx(
              'absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110',
              imageLayerClassName
            )}
            style={{
              backgroundImage: `url(${backgroundImage})`
            }}
          />
        ) : (
          fallback
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
        {tintColor && (
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay transition-opacity group-hover:opacity-30"
            style={{
              backgroundColor: tintColor
            }}
          />
        )}
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)'
          }}
        />
        {topOverlay}
        {hoverOverlay}
        {metaOverlay}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {children}
      </div>

      <div
        className="absolute inset-[-1px] z-[-1] bg-gradient-to-br from-white/20 via-transparent to-white/20 opacity-30 transition-opacity duration-300 group-hover:opacity-60"
        style={{
          clipPath: facetClipPaths.card
        }}
      />
    </div>
  );
}
