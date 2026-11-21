'use client';
import { useState } from 'react';
import type { User } from '@/types/crm';
import { Icon } from '@/components/ui/icon';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Header({ title, user }: { title: string; user: User }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

  async function logout() {
    if (pending) return;

    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error();

      window.location.replace('/login');
    } catch {
      setError('Не удалось выйти. Попробуйте ещё раз.');
      setPending(false);
    }
  }

  return (
    <header className='flex h-22 items-center justify-between border-b border-slate-200 bg-white px-10 max-[1200px]:px-6 max-[800px]:h-[72px] max-[800px]:px-5'>
      <div className='flex items-center gap-4 text-sm text-slate-400 [&_strong]:font-medium [&_strong]:text-slate-600 [&>span]:text-slate-300 max-[800px]:gap-2 max-[800px]:text-xs'>
        Рабочая область<span>/</span>
        <strong>{title}</strong>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className='flex cursor-pointer items-center gap-3 text-left [&_strong]:block [&_strong]:text-sm [&_small]:mt-1 [&_small]:block [&_small]:text-xs [&_small]:text-slate-400 [&_svg]:ml-2 [&_svg]:text-slate-400 max-[800px]:[&>div]:hidden'
          aria-label='Меню пользователя'
        >
          <span className='grid size-9 place-items-center rounded-full border border-indigo-100 bg-indigo-50 text-[11px] font-semibold text-indigo-500'>
            {initials}
          </span>
          <div>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <Icon name='chevron' size={16} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align='end'
            sideOffset={9}
            className='z-50 w-[235px] rounded-lg border border-slate-200 bg-white p-4 shadow-xl'
          >
            <DropdownMenu.Item
              onSelect={(event) => {
                event.preventDefault();
                void logout();
              }}
              disabled={pending}
              className='flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-600 cursor-pointer outline-none data-[highlighted]:bg-slate-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-40'
            >
              <Icon name='logout' size={17} />
              {pending ? 'Выход…' : 'Выйти'}
            </DropdownMenu.Item>
            {error && (
              <p role='alert' className='text-sm text-red-700'>
                {error}
              </p>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
