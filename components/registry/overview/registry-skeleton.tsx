export function RegistrySkeleton() {
  return (
    <div
      role='status'
      aria-label='Загрузка рабочего пространства'
      className='min-h-screen bg-slate-50 p-6 md:p-10'
    >
      <span className='sr-only'>Загрузка рабочего пространства…</span>
      <div aria-hidden='true' className='mx-auto max-w-7xl motion-safe:animate-pulse'>
        <div className='mb-8 h-9 w-64 rounded-lg bg-slate-200' />
        <div className='mb-8 grid gap-4 sm:grid-cols-3'>
          {[0, 1, 2].map((id) => (
            <div key={id} className='h-36 rounded-xl border border-slate-200 bg-white' />
          ))}
        </div>
        <div className='h-96 rounded-xl border border-slate-200 bg-white' />
      </div>
    </div>
  );
}
