'use client';
import { useState, type FormEvent } from 'react';
import { loginSchema } from '@/lib/validation/login';
import { getFieldErrors } from '@/lib/validation/errors';
import type { FieldErrors } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-controls';

export function LoginForm() {
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  function validate(form: HTMLFormElement) {
    const values = Object.fromEntries(new FormData(form));
    const result = loginSchema.safeParse({ ...values, email: String(values.email ?? '').trim() });
    setErrors(result.success ? {} : getFieldErrors(result.error));
    return result.success;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setSubmitted(true);
    setError('');
    if (!validate(event.currentTarget)) return;

    const data = new FormData(event.currentTarget);

    setPending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(data.get('email')).trim(),
          password: data.get('password'),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const fieldErrors =
          result.fieldErrors ?? (response.status === 401 ? { password: result.error } : undefined);
        setErrors(fieldErrors ?? {});
        setError(fieldErrors ? '' : result.error);
        setPending(false);
        return;
      }

      window.location.replace('/');
    } catch {
      setError('Не удалось войти. Проверьте соединение и попробуйте снова.');
      setPending(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      onChange={(event) => {
        if (submitted) validate(event.currentTarget);
        setError('');
      }}
      className='flex flex-col gap-5'
    >
      <fieldset disabled={pending} className='flex flex-col gap-5'>
        <Field label='Email' name='email' error={errors.email}>
          <Input
            name='email'
            error={errors.email}
            type='email'
            autoComplete='username'
            required
            maxLength={254}
            autoFocus
          />
        </Field>
        <Field label='Пароль' name='password' error={errors.password}>
          <Input
            name='password'
            error={errors.password}
            type='password'
            autoComplete='current-password'
            required
            maxLength={256}
          />
        </Field>
      </fieldset>

      {error && (
        <p role='alert' className='text-sm text-red-700'>
          {error}
        </p>
      )}

      <Button type='submit' variant='primary' disabled={pending}>
        {pending ? 'Вход…' : 'Войти'}
      </Button>
    </form>
  );
}
