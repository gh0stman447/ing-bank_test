import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Registry } from '@/components/registry/registry';
import { RegistrySkeleton } from '@/components/registry/overview/registry-skeleton';

async function Workspace() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  return <Registry user={user} />;
}

export default function Home() {
  return (
    <Suspense fallback={<RegistrySkeleton />}>
      <Workspace />
    </Suspense>
  );
}
