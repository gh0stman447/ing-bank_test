import type { FieldErrors } from '@/types/crm';
import type { Client } from '@/types/crm';
import { Field, Input } from '@/components/ui/form-controls';

export function ClientFields({ client, errors = {} }: { client?: Client; errors?: FieldErrors }) {
  return (
    <>
      <Field label='Название компании *' name='name' error={errors.name}>
        <Input
          error={errors.name}
          name='name'

          maxLength={160}
          defaultValue={client?.name}
          placeholder='ООО «Название компании»'
        />
      </Field>
      <Field label='Код клиента *' name='code' error={errors.code}>
        <Input
          error={errors.code}
          name='code'
          required
          maxLength={40}
          pattern='[A-Za-zА-Яа-яЁё0-9_\-]+'
          defaultValue={client?.code}
          placeholder='CL-013'
        />
        <small className='text-xs font-normal text-slate-400'>
          Буквы, цифры, дефис или подчёркивание
        </small>
      </Field>
    </>
  );
}
