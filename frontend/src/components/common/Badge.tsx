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
    'border border-blue-200 bg-blue-50 text-blue-700',

  red:
    'border border-red-200 bg-red-50 text-red-700',

  amber:
    'border border-yellow-200 bg-yellow-50 text-yellow-700',

  green:
    'border border-emerald-200 bg-emerald-50 text-emerald-700',

  gray:
    'border border-slate-300 bg-[#F8FAFC] text-slate-700'
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
