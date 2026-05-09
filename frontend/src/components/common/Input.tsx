import type { InputHTMLAttributes } from 'react';

type RegisterProps = {
  disabled?: boolean;
  name?: string;
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
  ref?: ((instance: HTMLInputElement | null) => void) | null;
  value?: InputHTMLAttributes<HTMLInputElement>['value'];
};

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size'
  > {
  error?: string;
  label?: string;
  register?: RegisterProps;
}

function Input({
  className = '',
  error,
  id,
  label,
  register,
  ...props
}: InputProps) {
  const inputId =
    id ??
    label?.toLowerCase().replace(/\s+/g, '-') ??
    undefined;

  return (
    <label
      className="flex w-full flex-col gap-2"
      htmlFor={inputId}
    >
      {/* Label */}
      {label ? (
        <span className="text-sm font-medium text-slate-300">
          {label}
        </span>
      ) : null}

      {/* Input */}
      <input
        id={inputId}
        className={[
          'min-h-[46px] rounded-[14px] border border-slate-700 bg-[#0F172A] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#185FA5] focus:ring-4 focus:ring-[#185FA5]/10',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
            : '',
          className
        ].join(' ')}
        {...register}
        {...props}
      />

      {/* Error */}
      {error ? (
        <span className="text-xs text-red-400">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export default Input;