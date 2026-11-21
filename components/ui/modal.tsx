'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { useRef, type ReactNode } from 'react';
import { Icon } from './icon';

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const returnFocus = useRef<HTMLElement | null>(null);

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm' />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            returnFocus.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus();
          }}
          className='fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(560px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-7 font-sans text-slate-800 shadow-2xl outline-none max-[800px]:p-5 [&_button]:cursor-pointer [&_button]:transition-colors'
        >
          <div className='mb-3.5 flex items-center justify-between'>
            <div>
              <span className='text-[10px] font-semibold tracking-[1.5px] text-slate-400'>
                РАБОЧАЯ ОБЛАСТЬ
              </span>
              <Dialog.Title className='mt-2 text-[22px] font-semibold'>{title}</Dialog.Title>
            </div>
            <Dialog.Close
              className='rounded-md bg-slate-50 p-2 text-slate-500 hover:bg-slate-100'
              aria-label='Закрыть'
            >
              <Icon name='close' />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
