import type { FieldErrors } from '@/types/crm';
import type { Client, Deal } from '@/types/crm';
import { Field, Input, Select, Textarea } from '@/components/ui/form-controls';
import { DEMO_DATE } from '@/constants/registry';

export function DealFields({
  deal,
  clients,
  errors = {},
}: {
  deal?: Deal;
  clients: Client[];
  errors?: FieldErrors;
}) {
  return (
    <>
      <div className='flex gap-4 max-[800px]:flex-col'>
        <Field label='Номер сделки *' name='number' error={errors.number}>
          <Input
            error={errors.number}
            name='number'
            required
            maxLength={60}
            defaultValue={deal?.number}
            placeholder='СД-2026-037'
          />
        </Field>
        <Field label='Дата сделки *' name='date' error={errors.date}>
          <Input
            error={errors.date}
            name='date'
            type='date'
            required
            defaultValue={deal?.date ?? DEMO_DATE}
          />
        </Field>
      </div>
      <Field label='Клиент *' name='client_id' error={errors.client_id}>
        <Select
          error={errors.client_id}
          name='client_id'
          required
          defaultValue={deal?.client_id ?? ''}
        >
          <option value='' disabled>
            Выберите клиента
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label='Сумма, ₽ *' name='amount' error={errors.amount}>
        <Input
          error={errors.amount}
          name='amount'
          type='number'
          required
          min='0.01'
          step='0.01'
          max='999999999999.99'
          defaultValue={deal?.amount}
          placeholder='0,00'
        />
      </Field>
      <Field label='Описание' name='description' error={errors.description}>
        <Textarea
          error={errors.description}
          name='description'
          maxLength={2000}
          rows={4}
          defaultValue={deal?.description}
          placeholder='Предмет сделки и дополнительные сведения'
        />
      </Field>
    </>
  );
}
