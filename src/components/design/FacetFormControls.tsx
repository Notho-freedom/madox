import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { facetClipPaths } from './tokens';
import { cx } from './utils';

type ControlShape = 'rounded' | 'buttonCut10' | 'buttonCut14';

function controlShapeStyle(shape: ControlShape, style?: React.CSSProperties) {
  if (shape === 'rounded') {
    return style;
  }

  return {
    ...style,
    clipPath: facetClipPaths[shape]
  };
}

const baseControlClassName =
  'w-full border border-white/10 bg-black/30 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-cyan-500/50';

interface FacetFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  inputClassName?: string;
  label?: string;
  labelClassName?: string;
  prefixIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  shape?: ControlShape;
}

export const FacetField = React.forwardRef<HTMLInputElement, FacetFieldProps>(
  function FacetField(
    {
      containerClassName,
      inputClassName,
      label,
      labelClassName,
      prefixIcon,
      shape = 'rounded',
      style,
      suffix,
      ...props
    },
    ref
  ) {
    return (
      <div className={containerClassName}>
        {label && (
          <label
            className={cx(
              'mb-2 block text-xs uppercase tracking-widest text-gray-500',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cx(
              baseControlClassName,
              shape === 'rounded' ? 'rounded-lg' : 'overflow-hidden',
              prefixIcon ? 'pl-10' : 'px-4',
              suffix ? 'pr-12' : 'pr-4',
              'py-3',
              inputClassName
            )}
            style={controlShapeStyle(shape, style)}
            {...props}
          />
          {suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>
      </div>
    );
  }
);

interface FacetTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  label?: string;
  labelClassName?: string;
  textareaClassName?: string;
}

export const FacetTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FacetTextareaProps
>(function FacetTextarea(
  {
    containerClassName,
    label,
    labelClassName,
    textareaClassName,
    ...props
  },
  ref
) {
  return (
    <div className={containerClassName}>
      {label && (
        <label
          className={cx(
            'mb-2 block text-xs uppercase tracking-widest text-gray-500',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cx(
          baseControlClassName,
          'w-full resize-none rounded-lg px-4 py-3',
          textareaClassName
        )}
        {...props}
      />
    </div>
  );
});

interface FacetSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
  label?: string;
  labelClassName?: string;
  selectClassName?: string;
  shape?: ControlShape;
}

export const FacetSelect = React.forwardRef<
  HTMLSelectElement,
  FacetSelectProps
>(function FacetSelect(
  {
    children,
    containerClassName,
    label,
    labelClassName,
    selectClassName,
    shape = 'rounded',
    style,
    ...props
  },
  ref
) {
  return (
    <div className={containerClassName}>
      {label && (
        <label
          className={cx(
            'mb-2 block text-xs uppercase tracking-widest text-gray-500',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cx(
            baseControlClassName,
            shape === 'rounded' ? 'rounded-lg' : 'overflow-hidden',
            'appearance-none px-4 py-3 pr-11',
            selectClassName
          )}
          style={controlShapeStyle(shape, style)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
});

interface FacetToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function FacetToggle({ enabled, onToggle }: FacetToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cx(
        'relative h-6 w-12 rounded-full transition-colors duration-300',
        enabled ? 'bg-cyan-500' : 'bg-white/10'
      )}
    >
      <motion.div
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-md"
        animate={{
          left: enabled ? 28 : 4
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      />
    </button>
  );
}
