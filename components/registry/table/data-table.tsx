import { flexRender, type Table } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { RegistryRecord } from '@/types/crm';
import { Icon } from '@/components/ui/icon';

export function DataTable({
  table,
  onOpen,
  onEdit,
  onDelete,
}: {
  table: Table<RegistryRecord>;
  onOpen: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full border-collapse text-left whitespace-nowrap'>
        <thead className='border-y border-slate-200 bg-slate-50'>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                const SortIcon =
                  sorted === 'desc' ? ArrowDown : sorted === 'asc' ? ArrowUp : ArrowUpDown;
                return (
                  <th
                    key={header.id}
                    className='px-4 py-3 text-sm font-normal text-slate-400 first:pl-6'
                    aria-sort={
                      sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'
                    }
                  >
                    <button
                      className='flex items-center gap-3'
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon
                        size={14}
                        className={sorted ? 'text-blue-700' : 'text-slate-300'}
                        aria-hidden='true'
                      />
                    </button>
                  </th>
                );
              })}
              <th>
                <span className='sr-only'>Действия</span>
              </th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className='border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50'
            >
              {row.getVisibleCells().map((cell, index) => (
                <td key={cell.id} className='h-[68px] px-4 py-4 text-sm text-slate-500 first:pl-6'>
                  {index === 0 ? (
                    <button
                      className='text-left font-medium text-blue-700 hover:underline'
                      onClick={() => onOpen(row.original.id)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </button>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </td>
              ))}
              <td className='px-4 py-4'>
                <div className='flex justify-end gap-3'>
                  <button
                    className='p-0.5 text-slate-400 hover:text-blue-700'
                    aria-label={`Редактировать запись ${row.original.id}`}
                    onClick={() => onEdit(row.original.id)}
                  >
                    <Icon name='edit' size={17} />
                  </button>
                  <button
                    className='p-0.5 text-slate-400 hover:text-red-600'
                    aria-label={`Удалить запись ${row.original.id}`}
                    onClick={() => onDelete(row.original.id)}
                  >
                    <Icon name='trash' size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {table.getRowModel().rows.length === 0 && (
        <div className='px-5 py-16 text-center text-slate-400'>
          <Icon name='search' size={30} className='mx-auto' />
          <h3 className='mb-2 mt-4 text-base font-semibold text-slate-500'>Ничего не найдено</h3>
          <p className='text-sm'>Попробуйте изменить поисковый запрос или фильтры.</p>
        </div>
      )}
    </div>
  );
}
