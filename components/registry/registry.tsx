'use client';
import type { User } from '@/types/crm';
import { RegistrySkeleton } from './overview/registry-skeleton';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Icon } from '@/components/ui/icon';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { COLUMNS, SECTIONS } from '@/constants/registry';
import { useRegistry } from '@/hooks/use-registry';
import { PageHeading } from './overview/page-heading';
import { StatCards } from './overview/stat-cards';
import { Filters } from './table/filters';
import { DataTable } from './table/data-table';
import { Pagination } from './table/pagination';
import { RecordForm } from './forms/record-form';

export function Registry({ user }: { user: User }) {
  const {
    loading,
    loadError,
    retry,
    deletingPending,
    section,
    clients,
    deals,
    filters,
    form,
    setForm,
    deleting,
    setDeleting,
    notice,
    setNotice,
    source,
    filtered,
    table,
    changeSection,
    changeFilters,
    open,
    save,
    remove,
  } = useRegistry();

  const config = SECTIONS[section];
  const hidden = table
    .getAllLeafColumns()
    .filter((c) => !c.getIsVisible())
    .map((c) => c.id);

  const pagination = table.getState().pagination;

  if (loading) return <RegistrySkeleton />;
  if (loadError)
    return (
      <main className='p-10'>
        <h1 className='mb-4 text-xl font-semibold'>Не удалось загрузить данные</h1>
        <p role='alert' className='mb-4 text-red-700'>
          {loadError}
        </p>
        <Button onClick={retry}>Повторить</Button>
      </main>
    );

  return (
    <div className='flex min-h-screen [&_button]:cursor-pointer [&_button]:transition-colors [&_button:disabled]:cursor-default [&_button:disabled]:opacity-40 [&_summary]:cursor-pointer [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden [&_svg]:shrink-0 [&_input]:accent-blue-600 [&_input]:outline-offset-2 [&_select]:outline-offset-2 [&_textarea]:outline-offset-2'>
      <Sidebar dealCount={deals.length} section={section} onChange={changeSection} />

      <div className='ml-[248px] w-[calc(100%-248px)] max-[1200px]:ml-[215px] max-[1200px]:w-[calc(100%-215px)] max-[800px]:ml-[76px] max-[800px]:w-[calc(100%-76px)]'>
        <Header title={config.title} user={user} />

        <main className='mx-auto max-w-[1600px] px-10 py-10 max-[1200px]:px-6 max-[1200px]:py-7 max-[800px]:px-5'>
          <PageHeading section={section} onCreate={() => setForm({ readOnly: false })} />
          <StatCards deals={deals} clients={clients} />

          <section className='rounded-[10px] border border-slate-200 bg-white shadow-[0_3px_8px_#1c2b4403]'>
            <div className='flex items-center justify-between px-6 pb-5 pt-6 [&>div]:flex [&>div]:items-center [&>div]:gap-2.5 [&_h2]:text-base [&_h2]:font-semibold'>
              <div>
                <h2>{config.listTitle}</h2>
                <span className='rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500'>
                  {source.length}
                </span>
              </div>
            </div>

            <Filters
              section={section}
              value={filters}
              onChange={changeFilters}
              clients={clients}
              columns={COLUMNS[section]}
              hidden={hidden}
              onToggle={(key) => table.getColumn(key)?.toggleVisibility()}
            />
            {notice && (
              <div
                className='flex items-center gap-2.5 bg-blue-50 px-6 py-3 text-sm text-blue-700 [&_button]:ml-auto'
                role='status'
              >
                <Icon name='check' size={16} />
                {notice}
                <button aria-label='Скрыть уведомление' onClick={() => setNotice('')}>
                  <Icon name='close' size={16} />
                </button>
              </div>
            )}

            <DataTable
              table={table}
              onOpen={(id) => open(id, true)}
              onEdit={(id) => open(id, false)}
              onDelete={setDeleting}
            />

            <Pagination
              page={pagination.pageIndex + 1}
              size={pagination.pageSize}
              total={filtered.length}
              onPage={(page) => table.setPageIndex(page - 1)}
              onSize={(v) => {
                table.setPageSize(v);
                table.setPageIndex(0);
              }}
            />
          </section>
        </main>
      </div>

      {form && (
        <RecordForm
          key={`${section}-${form.record?.id ?? 'new'}-${form.readOnly}`}
          section={section}
          record={form.record}
          clients={clients}
          readOnly={form.readOnly}
          onClose={() => setForm(null)}
          onSave={save}
          onEdit={() => setForm({ ...form, readOnly: false })}
        />
      )}

      {deleting !== null && (
        <ConfirmDialog
          pending={deletingPending}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </div>
  );
}
