import { PAGE_SIZES } from '@/constants/registry';
import { Icon } from '@/components/ui/icon';
export function Pagination({
  page,
  size,
  total,
  onPage,
  onSize,
}: {
  page: number;
  size: number;
  total: number;
  onPage: (page: number) => void;
  onSize: (size: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / size));

  return (
    <footer className='flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 text-sm text-slate-400 [&>div]:flex [&>div]:flex-wrap [&>div]:items-center [&>div]:gap-2 [&_label]:mr-3 [&_label]:flex [&_label]:items-center [&_label]:gap-2.5 [&_select]:rounded-md [&_select]:border [&_select]:border-slate-200 [&_select]:bg-white [&_select]:p-2 [&_select]:text-sm'>
      <span>
        {total ? `${(page - 1) * size + 1}–${Math.min(page * size, total)}` : '0'} из {total}{' '}
        записей
      </span>
      <div>
        <label className='mr-3 flex items-center gap-2.5'>
          На странице{' '}
          <select
            className='rounded-md border border-slate-200 bg-white p-2 text-sm'
            value={size}
            onChange={(e) => onSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <button
          className='grid size-8 place-items-center rounded text-sm text-slate-500 hover:bg-slate-100'
          disabled={page === 1}
          aria-label='Предыдущая страница'
          onClick={() => onPage(page - 1)}
        >
          <Icon name='arrow' size={16} />
        </button>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            className={`grid size-8 place-items-center rounded text-sm text-slate-500 hover:bg-slate-100 ${page === i + 1 ? '!bg-blue-50 !font-semibold !text-blue-700' : ''}`}
            onClick={() => onPage(i + 1)}
            aria-current={page === i + 1 ? 'page' : undefined}
          >
            {i + 1}
          </button>
        ))}
        <button
          className='grid size-8 place-items-center rounded text-sm text-slate-500 hover:bg-slate-100'
          disabled={page === pages}
          aria-label='Следующая страница'
          onClick={() => onPage(page + 1)}
        >
          <Icon name='arrow' size={16} className='rotate-180' />
        </button>
      </div>
    </footer>
  );
}
