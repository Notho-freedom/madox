import React from 'react';
import {
  facetClipPaths,
  facetGlowClasses,
  facetPanelToneClasses,
  type FacetClipPathName,
  type FacetPanelTone
} from './tokens';
import { cx } from './utils';

interface FacetPanelProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  tone?: FacetPanelTone;
  chrome?: 'full' | 'subtle' | 'none';
  shape?: Extract<FacetClipPathName, 'panel' | 'panelWide'>;
}

export function FacetPanel({
  children,
  className,
  contentClassName,
  tone = 'default',
  chrome = 'full',
  shape = 'panel'
}: FacetPanelProps) {
  const clipPath = facetClipPaths[shape];
  const toneClasses = facetPanelToneClasses[tone];
  const showChrome = chrome !== 'none';

  return (
    <div
      className={cx('relative overflow-hidden', className)}
      style={{
        clipPath
      }}
    >
      <div className={cx('absolute inset-0', toneClasses.background)} />
      <div className={cx('absolute inset-0', toneClasses.wash)} />
      {showChrome && (
        <div
          className={cx(
            'absolute inset-0 prism-border',
            chrome === 'subtle' ? 'opacity-22' : toneClasses.borderOpacity
          )}
          style={{
            clipPath
          }}
        />
      )}
      {chrome === 'full' && <div className={facetGlowClasses.primary} />}
      {chrome === 'full' && <div className={facetGlowClasses.secondary} />}
      <div className={cx('relative z-10', contentClassName)}>{children}</div>
    </div>
  );
}
