import Link from 'next/link';
import type { Section } from '@/types/crm';
import { Icon } from '@/components/ui/icon';
export function Sidebar({
  section,
  onChange,
  dealCount,
}: {
  dealCount: number;
  section: Section;
  onChange: (section: Section) => void;
}) {
  return (
    <aside className='fixed inset-y-0 left-0 flex w-[248px] shrink-0 flex-col border-r border-slate-200 bg-white px-5 pt-9 max-[1200px]:w-[215px] max-[1200px]:px-3.5 max-[800px]:w-[76px] max-[800px]:px-2.5 max-[800px]:pt-6'>
      <Link
        href='/'
        className='flex items-center gap-2.5 px-2 text-[29px] font-bold tracking-[-1.2px] max-[800px]:justify-center max-[800px]:p-0 max-[800px]:text-[0px]'
      >
        <span className='grid size-9 place-items-center rounded-[10px] bg-blue-700 text-white'>
          <Icon name='grid' size={23} />
        </span>
        контур<span className='-ml-2 text-blue-700 max-[800px]:hidden'>.</span>
      </Link>
      <span className='mx-3 mb-3 mt-8 text-[10px] tracking-widest text-slate-400 max-[800px]:hidden'>
        РАБОЧАЯ ОБЛАСТЬ
      </span>
      <nav aria-label='Основная навигация'>
        <button
          className={
            section === 'deals'
              ? 'mb-1.5 flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-medium text-slate-500 hover:bg-slate-50 max-[800px]:justify-center max-[800px]:px-0 max-[800px]:py-4 max-[800px]:text-[0px] !bg-blue-50 !text-blue-700'
              : 'mb-1.5 flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-medium text-slate-500 hover:bg-slate-50 max-[800px]:justify-center max-[800px]:px-0 max-[800px]:py-4 max-[800px]:text-[0px]'
          }
          onClick={() => onChange('deals')}
        >
          <Icon name='deals' />
          Сделки
          <span className='ml-auto rounded bg-blue-100 px-1.5 py-0.5 text-[11px] max-[800px]:hidden'>
            {dealCount}
          </span>
        </button>
        <button
          className={
            section === 'clients'
              ? 'mb-1.5 flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-medium text-slate-500 hover:bg-slate-50 max-[800px]:justify-center max-[800px]:px-0 max-[800px]:py-4 max-[800px]:text-[0px] !bg-blue-50 !text-blue-700'
              : 'mb-1.5 flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-medium text-slate-500 hover:bg-slate-50 max-[800px]:justify-center max-[800px]:px-0 max-[800px]:py-4 max-[800px]:text-[0px]'
          }
          onClick={() => onChange('clients')}
        >
          <Icon name='clients' />
          Клиенты
        </button>
      </nav>
    </aside>
  );
}
