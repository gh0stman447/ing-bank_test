import type { ComponentProps, ReactNode } from 'react';

export function Field({
  label,
  children,
  name,
  error,
}: {
  label: string;
  children: ReactNode;
  name?: string;
  error?: string;
}) {
  return (
    <label className='flex min-w-0 flex-1 flex-col gap-2 text-sm font-medium'>
      {label}
      {children}
      {error && (
        <span id={`${name}-error`} role='alert' className='text-sm font-normal text-red-600'>
          {error}
        </span>
      )}
    </label>
  );
}

export function Input({
  className = '',
  error,
  ...props
}: ComponentProps<'input'> & { error?: string }) {
  return (
    <input
      {...props}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${props.name}-error` : undefined}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal placeholder:text-slate-400 focus:outline-2 focus:outline-blue-200 disabled:bg-slate-50 aria-invalid:border-red-500 aria-invalid:focus:outline-red-200 ${className}`}
    />
  );
}

export function Select({
  className = '',
  error,
  ...props
}: ComponentProps<'select'> & { error?: string }) {
  return (
    <select
      {...props}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${props.name}-error` : undefined}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal focus:outline-2 focus:outline-blue-200 disabled:bg-slate-50 aria-invalid:border-red-500 aria-invalid:focus:outline-red-200 ${className}`}
    />
  );
}

export function Textarea({
  className = '',
  error,
  ...props
}: ComponentProps<'textarea'> & { error?: string }) {
  return (
    <textarea
      {...props}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${props.name}-error` : undefined}
      className={`w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal placeholder:text-slate-400 focus:outline-2 focus:outline-blue-200 disabled:bg-slate-50 aria-invalid:border-red-500 aria-invalid:focus:outline-red-200 ${className}`}
    />
  );
}
