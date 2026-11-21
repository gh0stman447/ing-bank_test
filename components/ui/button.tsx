import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'danger';
};
export function Button({
  variant = 'secondary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-default disabled:opacity-40 ${variant === 'primary' ? 'border-blue-700 bg-blue-700 text-white shadow-sm hover:bg-blue-800' : variant === 'danger' ? 'border-red-700 bg-red-700 text-white hover:bg-red-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'} ${className}`}
    />
  );
}
