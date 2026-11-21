import type { Client, Deal } from '@/types/crm';
import { money } from '@/lib/format';
import { Icon } from '@/components/ui/icon';

export function StatCards({ deals, clients }: { deals: Deal[]; clients: Client[] }) {
  const total = deals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className='mb-7 grid grid-cols-[1.25fr_1fr_1fr] gap-4 max-[800px]:grid-cols-2 max-[800px]:[&>article:first-child]:col-span-2'>
      <article className='rounded-[10px] border border-slate-200 bg-white px-6 py-5 [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:text-sm [&>div]:text-slate-500 [&_svg]:size-[17px] [&_svg]:text-slate-400 [&>strong]:mb-2 [&>strong]:mt-3.5 [&>strong]:block [&>strong]:text-[28px] [&>strong]:font-semibold [&>strong]:tracking-tight [&_em]:ml-2 [&_em]:text-sm [&_em]:font-normal [&_em]:not-italic [&_em]:tracking-normal [&_em]:text-slate-400 [&_small]:text-xs [&_small]:leading-relaxed [&_small]:text-slate-400 max-[1200px]:px-5 max-[1200px]:[&>strong]:text-2xl max-[800px]:p-4'>
        <div>
          <span>Объём сделок</span>
          <Icon name='deals' />
        </div>
        <strong>{money(total)}</strong>
        <small>По всем сделкам в рабочем пространстве</small>
      </article>
      <article className='rounded-[10px] border border-slate-200 bg-white px-6 py-5 [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:text-sm [&>div]:text-slate-500 [&_svg]:size-[17px] [&_svg]:text-slate-400 [&>strong]:mb-2 [&>strong]:mt-3.5 [&>strong]:block [&>strong]:text-[28px] [&>strong]:font-semibold [&>strong]:tracking-tight [&_em]:ml-2 [&_em]:text-sm [&_em]:font-normal [&_em]:not-italic [&_em]:tracking-normal [&_em]:text-slate-400 [&_small]:text-xs [&_small]:leading-relaxed [&_small]:text-slate-400 max-[1200px]:px-5 max-[1200px]:[&>strong]:text-2xl max-[800px]:p-4'>
        <div>
          <span>Всего сделок</span>
          <Icon name='grid' />
        </div>
        <strong>
          {deals.length}
          <em>сделок</em>
        </strong>
        <small>В вашем реестре</small>
      </article>
      <article className='rounded-[10px] border border-slate-200 bg-white px-6 py-5 [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:text-sm [&>div]:text-slate-500 [&_svg]:size-[17px] [&_svg]:text-slate-400 [&>strong]:mb-2 [&>strong]:mt-3.5 [&>strong]:block [&>strong]:text-[28px] [&>strong]:font-semibold [&>strong]:tracking-tight [&_em]:ml-2 [&_em]:text-sm [&_em]:font-normal [&_em]:not-italic [&_em]:tracking-normal [&_em]:text-slate-400 [&_small]:text-xs [&_small]:leading-relaxed [&_small]:text-slate-400 max-[1200px]:px-5 max-[1200px]:[&>strong]:text-2xl max-[800px]:p-4'>
        <div>
          <span>Клиентская база</span>
          <Icon name='clients' />
        </div>
        <strong>
          {clients.length}
          <em>клиентов</em>
        </strong>
        <small>Компании, с которыми вы работаете</small>
      </article>
    </div>
  );
}
