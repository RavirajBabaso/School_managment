import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-[var(--border-color)] bg-[var(--card-bg)] text-[#185FA5] hover:bg-[var(--surface)] focus-visible:ring-[#185FA5]/20 dark:text-[#BFDBFE]',
  danger:
    'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-300/20 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200 dark:hover:bg-red-900/70',
  ghost:
    'border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface)] focus-visible:ring-[#185FA5]/10 dark:text-[var(--text-secondary)] dark:hover:bg-[var(--panel-bg)]'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[32px] px-3 text-xs',
  md: 'min-h-[36px] px-4 text-sm',
  lg: 'min-h-[40px] px-5 text-sm'
};

function Button({
  children,
  className = '',
  disabled = false,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-[10px] border-[0.5px] border-solid font-semibold transition focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className
      ].join(' ')}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
