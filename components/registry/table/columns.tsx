import type { ColumnDef } from '@tanstack/react-table';
import type { Client, Section, RegistryRecord } from '@/types/crm';
import { COLUMNS } from '@/constants/registry';
import { dateLabel, money } from '@/lib/format';

function Company({ name, id }: { name: string; id: number }) {
  return (
    <span className='inline-flex items-center gap-2 text-slate-600'>
      <span
        className={`inline-grid size-7 shrink-0 place-items-center rounded-md text-[11px] font-medium ${id % 3 === 0 ? 'bg-indigo-50 text-indigo-500' : id % 3 === 1 ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-500'}`}
      >
        {name.slice(5, 6)}
      </span>
      {name}
    </span>
  );
}

export function getColumns(section: Section, clients: Client[]): ColumnDef<RegistryRecord>[] {
  const labels = COLUMNS[section];

  return labels.map(({ key, label }) => ({
    id: key,
    header: label,
    accessorFn: (record) => {
      if (key === 'id') return record.id;
      if ('code' in record) return key === 'name' ? record.name : record.code;

      switch (key) {
        case 'client_id':
          return clients.find((client) => client.id === record.client_id)?.name ?? '';
        case 'date':
          return record.date;
        case 'number':
          return record.number;
        case 'amount':
          return record.amount;
        case 'description':
          return record.description;
        default:
          return '';
      }
    },

    sortingFn: (a, b, columnId) => {
      const x = a.getValue<string | number>(columnId),
        y = b.getValue<string | number>(columnId);
      return typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x).localeCompare(String(y), 'ru', { numeric: true });
    },

    cell: ({ row, getValue }) => {
      const record = row.original;
      const value = getValue<string | number>();

      if (key === 'id') return <span className='text-slate-400'>#{record.id}</span>;
      if (key === 'name' && 'name' in record) return <Company name={record.name} id={record.id} />;
      if (key === 'client_id' && 'client_id' in record)
        return <Company name={String(value)} id={record.client_id} />;

      if (key === 'amount')
        return (
          <span className='font-semibold whitespace-nowrap text-slate-700 tabular-nums'>
            {money(Number(value))}
          </span>
        );

      if (key === 'date') return dateLabel(String(value));

      if (key === 'description')
        return (
          <span
            className='block max-w-[180px] truncate text-sm text-slate-400'
            title={String(value)}
          >
            {value || '—'}
          </span>
        );

      if (key === 'code')
        return <span className='rounded bg-slate-100 px-2 py-1 font-mono text-xs'>{value}</span>;

      return value;
    },
  }));
}
