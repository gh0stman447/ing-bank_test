import type { Client, Column, Section, RegistryFilters } from '@/types/crm';
import { Icon } from '@/components/ui/icon';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
export function Filters({
  section,
  value,
  onChange,
  clients,
  columns,
  hidden,
  onToggle,
}: {
  section: Section;
  value: RegistryFilters;
  onChange: (value: RegistryFilters) => void;
  clients: Client[];
  columns: Column[];
  hidden: string[];
  onToggle: (key: string) => void;
}) {
  const set = (key: keyof RegistryFilters, next: string) => onChange({ ...value, [key]: next });

  return (
    <div className='flex flex-wrap items-center gap-2.5 gap-y-3 px-6 pb-6 [&>select]:h-[37px] [&>select]:max-w-[190px] [&>select]:rounded-md [&>select]:border [&>select]:border-slate-200 [&>select]:bg-white [&>select]:px-2 [&>select]:text-sm max-[800px]:[&>select]:max-w-none max-[800px]:[&>select]:flex-1'>
      <label className='flex h-[37px] min-w-[200px] flex-1 items-center gap-2 rounded-md border border-slate-200 px-3 text-slate-400 focus-within:ring-2 focus-within:ring-blue-200 [&_input]:min-w-0 [&_input]:w-full [&_input]:text-sm [&_input]:text-slate-700 [&_input]:outline-none [&_input]:placeholder:text-slate-400 max-[800px]:min-w-full'>
        <Icon name='search' size={18} />
        <input
          aria-label={section === 'deals' ? 'Поиск по номеру сделки' : 'Поиск по названию или коду'}
          placeholder={
            section === 'deals' ? 'Найти по номеру сделки…' : 'Название или код клиента…'
          }
          value={value.search}
          onChange={(e) => set('search', e.target.value)}
        />
      </label>

      {section === 'deals' && (
        <>
          <label className='flex h-[37px] items-center gap-1.5 rounded-md border border-slate-200 px-2 text-slate-400 [&_input]:w-[119px] [&_input]:bg-transparent [&_input]:text-sm [&_input]:text-slate-600 [&_input::-webkit-calendar-picker-indicator]:w-3 [&_input::-webkit-calendar-picker-indicator]:opacity-40 [&>span]:text-slate-300 max-[1200px]:order-3 max-[800px]:order-none max-[800px]:w-full max-[800px]:justify-between max-[800px]:[&_input]:w-[42%]'>
            <Icon name='calendar' size={17} />
            <input
              aria-label='Начало периода'
              type='date'
              required
              value={value.from}
              max={value.to}
              onChange={(e) => {
                if (e.target.value) set('from', e.target.value);
              }}
            />
            <span>—</span>
            <input
              aria-label='Конец периода'
              type='date'
              required
              value={value.to}
              min={value.from}
              onChange={(e) => {
                if (e.target.value) set('to', e.target.value);
              }}
            />
          </label>
          <select
            aria-label='Фильтр по клиенту'
            value={value.client}
            onChange={(e) => set('client', e.target.value)}
          >
            <option value=''>Все клиенты</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </>
      )}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='cursor-pointer max-[1200px]:ml-auto max-[800px]:ml-0 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium whitespace-nowrap text-slate-600 hover:bg-slate-50'>
          <Icon name='columns' size={17} />
          Колонки
          <Icon name='chevron' size={15} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align='end'
            sideOffset={9}
            className='z-50 w-[235px] rounded-lg border border-slate-200 bg-white p-2 shadow-xl'
          >
            <DropdownMenu.Label className='px-2 py-2 text-xs font-semibold'>
              Показать колонки
            </DropdownMenu.Label>
            {columns.map((c) => (
              <DropdownMenu.CheckboxItem
                key={c.key}
                checked={!hidden.includes(c.key)}
                disabled={!hidden.includes(c.key) && hidden.length === columns.length - 1}
                onCheckedChange={() => onToggle(c.key)}
                onSelect={(event) => event.preventDefault()}
                className='flex cursor-pointer items-center gap-2.5 rounded px-2 py-2 text-sm outline-none data-[highlighted]:bg-slate-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-40'
              >
                <span className='grid size-4 place-items-center rounded border border-slate-300 text-blue-600'>
                  <DropdownMenu.ItemIndicator>
                    <Icon name='check' size={12} />
                  </DropdownMenu.ItemIndicator>
                </span>
                {c.label}
              </DropdownMenu.CheckboxItem>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
