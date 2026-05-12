import type {
  ButtonHTMLAttributes,
  ReactNode
} from 'react';

type ButtonVariant =
  | 'primary'
  | 'danger'
  | 'ghost';

type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

/* Variants */

const variantClasses: Record<
  ButtonVariant,
  string
> = {
  primary:
    'border border-[#185FA5] bg-[#185FA5] text-white hover:bg-[#226fc0] hover:border-[#226fc0] focus-visible:ring-[#185FA5]/20',

  danger:
    'border border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600 focus-visible:ring-red-500/20',

  ghost:
    'border border-slate-300 bg-[#F8FAFC] text-slate-700 hover:bg-[#EEF4FF] hover:text-slate-950 focus-visible:ring-[#185FA5]/10'
};

/* Sizes */

const sizeClasses: Record<
  ButtonSize,
  string
> = {
  sm: 'min-h-[36px] px-3 text-xs',
  md: 'min-h-[42px] px-5 text-sm',
  lg: 'min-h-[48px] px-6 text-sm'
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
        'inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm',
        variantClasses[variant],
        sizeClasses[size],
        className
      ].join(' ')}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {/* Loader */}
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}

      {/* Text */}
      <span>{children}</span>
    </button>
  );
}

export default Button;
