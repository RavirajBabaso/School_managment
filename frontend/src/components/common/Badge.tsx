import type { ReactNode } from 'react';

type BadgeVariant = 'blue' | 'red' | 'amber' | 'green' | 'gray';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  blue: 'border-blue-200/70 bg-blue-100 text-blue-700 dark:border-blue-300/30 dark:bg-blue-500/10 dark:text-blue-200',
  red: 'border-red-200/70 bg-red-100 text-red-700 dark:border-red-300/30 dark:bg-red-500/10 dark:text-red-200',
  amber: 'border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-300/30 dark:bg-amber-500/10 dark:text-amber-200',
  green: 'border-emerald-200/70 bg-emerald-100 text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-500/10 dark:text-emerald-200',
  gray: 'border-slate-300/70 bg-slate-100 text-slate-700 dark:border-slate-500/30 dark:bg-slate-800/70 dark:text-slate-200'
};

function Badge({ children, className = '', variant = 'gray' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex min-h-[20px] items-center rounded-full border-[0.5px] px-2.5 text-[11px] font-semibold leading-5',
        badgeVariants[variant],
        className
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export default Badge;
