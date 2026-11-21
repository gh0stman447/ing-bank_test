import type { Section } from '@/types/crm';
import { SECTIONS } from '@/constants/registry';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export function PageHeading({ section, onCreate }: { section: Section; onCreate: () => void }) {
  const { title, createLabel } = SECTIONS[section];
  return (
    <div className='mb-7 flex items-center justify-between gap-5 max-[800px]:flex-col max-[800px]:items-start'>
      <h1 className='text-3xl font-semibold tracking-tight'>{title}</h1>
      <Button variant='primary' onClick={onCreate}>
        <Icon name='plus' size={18} />
        {createLabel}
      </Button>
    </div>
  );
}
