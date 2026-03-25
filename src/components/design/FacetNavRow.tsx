import React from 'react';
import { facetClipPaths } from './tokens';
import { cx } from './utils';

interface FacetNavRowProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: React.ReactNode;
  active?: boolean;
  className?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  layout?: 'desktop' | 'mobile';
  onClick?: () => void;
  rightSlot?: React.ReactNode;
  tone?: 'default' | 'danger';
}

export function FacetNavRow({
  active = false,
  children,
  className,
  icon,
  label,
  layout = 'desktop',
  onClick,
  rightSlot,
  tone = 'default',
  type = 'button',
  ...props
}: FacetNavRowProps) {
  const isDanger = tone === 'danger';
  const rowHighlightClass = isDanger
    ? 'from-red-500/10 via-white/[0.04] to-transparent'
    : 'from-cyan-500/12 via-white/[0.04] to-transparent';
  const iconHighlightClass = isDanger
    ? 'to-red-400/10'
    : 'to-cyan-400/10';
  const activeTextClass = isDanger ? 'text-red-400' : 'text-cyan-300';
  const baseTextClass = isDanger
    ? 'text-red-400 group-hover:text-red-300'
    : 'text-gray-500 group-hover:text-white';

  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        'group relative overflow-hidden text-left',
        layout === 'desktop'
          ? 'grid h-12 w-full grid-cols-[96px_minmax(0,1fr)] items-center'
          : 'flex h-12 w-full items-center px-3',
        className
      )}
      style={{
        clipPath: facetClipPaths.navRow
      }}
      {...props}
    >
      <div
        className={cx(
          'pointer-events-none absolute inset-y-[2px] transition-all duration-300',
          layout === 'desktop' ? 'left-3 right-4' : 'inset-x-0',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
        style={{
          clipPath: facetClipPaths.navRow
        }}
      >
        <div className={cx('absolute inset-0 bg-gradient-to-r', rowHighlightClass)} />
        <div
          className="absolute inset-0 prism-border"
          style={{
            clipPath: facetClipPaths.navRow
          }}
        />
      </div>

      {icon && (
        <div className={cx('flex items-center justify-center', layout === 'mobile' && 'mr-3')}>
          <div
            className={cx(
              'relative flex h-12 w-12 items-center justify-center overflow-hidden transition-all duration-300',
              active
                ? isDanger
                  ? 'bg-red-500/10'
                  : 'bg-cyan-500/10 shadow-[0_0_22px_rgba(34,211,238,0.16)]'
                : 'bg-white/[0.015] group-hover:bg-white/[0.03]'
            )}
            style={{
              clipPath: facetClipPaths.navIcon
            }}
          >
            <div
              className={cx(
                'absolute inset-0 bg-gradient-to-br from-white/10 via-transparent',
                iconHighlightClass
              )}
            />
            <div
              className={cx(
                'absolute inset-0 prism-border transition-opacity duration-300',
                active ? 'opacity-90' : 'opacity-38 group-hover:opacity-68'
              )}
              style={{
                clipPath: facetClipPaths.navIcon
              }}
            />
            <div
              className={cx(
                'relative z-10 transition-colors duration-200',
                active ? activeTextClass : baseTextClass
              )}
            >
              {icon}
            </div>
          </div>
        </div>
      )}

      <div className={cx('relative z-10 min-w-0', layout === 'desktop' && 'pr-6')}>
        {label && (
          <div
            className={cx(
              'whitespace-nowrap text-sm uppercase tracking-[0.22em] transition-colors duration-200',
              active ? activeTextClass : baseTextClass
            )}
          >
            {label}
          </div>
        )}
      </div>

      {rightSlot && <div className="relative z-10 ml-auto">{rightSlot}</div>}
      {children}
    </button>
  );
}
