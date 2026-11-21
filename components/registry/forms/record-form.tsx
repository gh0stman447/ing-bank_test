import { clientSchema } from '@/lib/validation/client';
import { dealSchema } from '@/lib/validation/deal';
import { getFieldErrors } from '@/lib/validation/errors';
import { Button } from '@/components/ui/button';
import { ClientFields } from './client-fields';
import { DealFields } from './deal-fields';
import { useState, type FormEvent } from 'react';
import type { Client, Deal, Section, FieldErrors, FormError } from '@/types/crm';
import { Modal } from '@/components/ui/modal';

export function RecordForm({
  section,
  record,
  clients,
  readOnly,
  onClose,
  onSave,
  onEdit,
}: {
  section: Section;
  record?: Client | Deal;
  clients: Client[];
  readOnly: boolean;
  onClose: () => void;
  onSave: (record: Client | Deal) => Promise<FormError | undefined>;
  onEdit: () => void;
}) {
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const deal = record && 'amount' in record ? record : undefined;
  const client = record && 'code' in record ? record : undefined;

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const values = Object.fromEntries(data);
    const result =
      section === 'clients'
        ? clientSchema.safeParse(values)
        : dealSchema.safeParse({
            ...values,
            amount: Number(data.get('amount')),
            client_id: Number(data.get('client_id')),
          });
    const nextErrors = result.success ? {} : getFieldErrors(result.error);
    setErrors(nextErrors);
    return result.success;
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setSubmitted(true);
    setError('');
    if (!validate(e.currentTarget)) return;
    const data = new FormData(e.currentTarget);
    const id = record?.id ?? 0;
    const next =
      section === 'clients'
        ? {
            id,
            name: String(data.get('name')).trim(),
            code: String(data.get('code')).trim(),
          }
        : {
            id,
            date: String(data.get('date')),
            number: String(data.get('number')).trim(),
            amount: Number(data.get('amount')),
            client_id: Number(data.get('client_id')),
            description: String(data.get('description')).trim(),
          };
    setPending(true);
    try {
      const issue = await onSave(next);
      if (issue) {
        setErrors(issue.fieldErrors ?? {});
        setError(issue.fieldErrors ? '' : issue.message);
      }
    } catch {
      setError('Не удалось сохранить запись.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      title={`${readOnly ? 'Карточка' : record ? 'Редактирование' : 'Создание'} ${section === 'deals' ? 'сделки' : 'клиента'}`}
      onClose={() => {
        if (!pending) onClose();
      }}
    >
      <form
        noValidate
        onSubmit={submit}
        onChange={(event) => {
          if (submitted) validate(event.currentTarget);
          setError('');
        }}
      >
        <p className='mb-6 text-xs text-slate-400'>
          {readOnly ? `Запись № ${record?.id}` : 'Поля со звёздочкой обязательны для заполнения.'}
        </p>
        <fieldset className='m-0 flex flex-col gap-5 border-0 p-0' disabled={readOnly || pending}>
          {section === 'clients' ? (
            <ClientFields client={client} errors={errors} />
          ) : (
            <DealFields deal={deal} clients={clients} errors={errors} />
          )}
        </fieldset>

        {error && (
          <p role='alert' className='mt-4 rounded bg-red-50 p-2.5 text-sm text-red-700'>
            {error}
          </p>
        )}

        <div className='mt-7 flex justify-end gap-2.5 border-t border-slate-200 pt-5'>
          <Button type='button' disabled={pending} onClick={onClose}>
            {readOnly ? 'Закрыть' : 'Отмена'}
          </Button>
          {readOnly ? (
            <Button type='button' variant='primary' onClick={onEdit}>
              Редактировать
            </Button>
          ) : (
            <Button variant='primary' type='submit' disabled={pending}>
              {pending ? 'Сохранение…' : record ? 'Сохранить изменения' : 'Создать'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
