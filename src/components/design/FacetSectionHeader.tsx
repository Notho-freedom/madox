import React from 'react';
import { cx } from './utils';

interface FacetSectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
  count?: React.ReactNode;
  icon?: React.ReactNode;
  titleClassName?: string;
}

export function FacetSectionHeader({
  title,
  action,
  className,
  count,
  icon,
  titleClassName
}: FacetSectionHeaderProps) {
  return (
    <div className={cx('flex items-center gap-4', className)}>
      <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_16px_rgba(34,211,238,0.55)]" />
      {icon && <div className="text-cyan-300">{icon}</div>}
      <h2
        className={cx(
          "font-['Advent_Pro'] text-3xl font-bold text-white",
          titleClassName
        )}
      >
        {title}
      </h2>
      {count && <div>{count}</div>}
      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      {action}
    </div>
  );
}
