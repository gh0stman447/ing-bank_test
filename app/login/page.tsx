import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { LoginForm } from '@/components/auth/login-form';

async function Login() {
  if (await getCurrentUser()) redirect('/');

  return (
    <main className='grid min-h-screen place-items-center p-5'>
      <section className='w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm'>
        <h1 className='mb-7 text-2xl font-semibold'>Вход в Контур</h1>
        <LoginForm />
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className='p-10' role='status'>
          Загрузка…
        </p>
      }
    >
      <Login />
    </Suspense>
  );
}
