import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { facetClipPaths } from './tokens';
import { cx } from './utils';

type FacetButtonVariant = 'solid' | 'ghost' | 'outline';
type FacetButtonSize = 'sm' | 'md' | 'lg';
type FacetButtonShape = 'buttonFacet' | 'buttonCut8' | 'buttonCut10' | 'buttonCut14';

export interface FacetButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  size?: FacetButtonSize;
  shape?: FacetButtonShape;
  variant?: FacetButtonVariant;
}

const sizeClasses: Record<FacetButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm'
};

const variantClasses: Record<FacetButtonVariant, string> = {
  solid:
    'bg-white text-black hover:bg-cyan-50 border border-transparent shadow-[0_10px_24px_rgba(255,255,255,0.06)]',
  ghost:
    'bg-white/5 text-white border border-white/15 hover:bg-white/10',
  outline:
    'bg-cyan-500/12 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/18'
};

export function FacetButton({
  children,
  className,
  disabled,
  leadingIcon,
  trailingIcon,
  size = 'md',
  shape = 'buttonFacet',
  type = 'button',
  variant = 'ghost',
  ...props
}: FacetButtonProps) {
  const isFacetShape = shape === 'buttonFacet';

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={cx(
        'group relative inline-flex items-center justify-center gap-3 overflow-hidden font-bold uppercase tracking-widest transition-colors',
        isFacetShape && 'clip-facet-btn',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      style={
        isFacetShape ?
          props.style :
          {
            ...props.style,
            clipPath: facetClipPaths[shape]
          }
      }
      {...props}
    >
      {variant === 'solid' && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-white to-cyan-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      {leadingIcon && <span className="relative z-10">{leadingIcon}</span>}
      <span className="relative z-10">{children}</span>
      {trailingIcon && <span className="relative z-10">{trailingIcon}</span>}
    </motion.button>
  );
}

export interface FacetIconButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: React.ReactNode;
  className?: string;
  label: string;
  active?: boolean;
}

export function FacetIconButton({
  active = false,
  className,
  icon,
  label,
  type = 'button',
  ...props
}: FacetIconButtonProps) {
  return (
    <motion.button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        'relative inline-flex h-12 w-12 items-center justify-center overflow-hidden border transition-colors',
        active
          ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
          : 'border-white/20 bg-white/5 text-white hover:text-cyan-300',
        className
      )}
      style={{
        clipPath: facetClipPaths.buttonCut10,
        ...props.style
      }}
      {...props}
    >
      <span className="relative z-10">{icon}</span>
    </motion.button>
  );
}
