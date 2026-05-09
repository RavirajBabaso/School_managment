import type { ReactNode } from 'react';

type BadgeVariant =
  | 'blue'
  | 'red'
  | 'amber'
  | 'green'
  | 'gray';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

/* Dashboard Variants */

const badgeVariants: Record<
  BadgeVariant,
  string
> = {
  blue:
    'border border-blue-500/20 bg-blue-500/10 text-blue-400',

  red:
    'border border-red-500/20 bg-red-500/10 text-red-400',

  amber:
    'border border-yellow-500/20 bg-yellow-500/10 text-yellow-400',

  green:
    'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',

  gray:
    'border border-slate-700 bg-[#0F172A] text-slate-300'
};

function Badge({
  children,
  className = '',
  variant = 'gray'
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex min-h-[26px] items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide shadow-sm',
        badgeVariants[variant],
        className
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export default Badge;