import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cx } from './utils';

interface FacetMediaTileProps {
  imageAlt: string;
  imageSrc?: string | null;
  className?: string;
  fallback?: React.ReactNode;
  onClick?: () => void;
  overlayLabel?: string;
  overlaySubtitle?: string;
  overflowCaption?: string;
  overflowLabel?: string;
}

export function FacetMediaTile({
  imageAlt,
  imageSrc,
  className,
  fallback,
  onClick,
  overflowCaption,
  overlayLabel,
  overlaySubtitle,
  overflowLabel
}: FacetMediaTileProps) {
  const sharedProps = {
    className: cx(
      'group relative min-h-0 overflow-hidden rounded-[22px] bg-white/[0.04] text-left',
      className
    ),
    initial: {
      opacity: 0,
      y: 16
    },
    whileInView: {
      opacity: 1,
      y: 0
    },
    viewport: {
      once: true,
      margin: '-40px'
    },
    transition: {
      duration: 0.4
    },
  } as const;

  const content = (
    <>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        fallback ?? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
            <User size={32} className="text-gray-600" />
          </div>
        )
      )}

      {(overlayLabel || overlaySubtitle) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/88 via-black/45 to-transparent px-3 pb-3 pt-12">
          {overlayLabel && (
            <div className="line-clamp-1 text-sm font-bold text-white">
              {overlayLabel}
            </div>
          )}
          {overlaySubtitle && (
            <div className="line-clamp-2 text-xs text-cyan-100/78">
              {overlaySubtitle}
            </div>
          )}
        </div>
      )}

      {overflowLabel && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
          <div className="text-center">
            <div className="font-['Advent_Pro'] text-3xl font-bold text-white">
              {overflowLabel}
            </div>
            {overflowCaption && (
              <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-cyan-200">
                {overflowCaption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button type="button" onClick={onClick} {...sharedProps}>
        {content}
      </motion.button>
    );
  }

  return <motion.div {...sharedProps}>{content}</motion.div>;
}
