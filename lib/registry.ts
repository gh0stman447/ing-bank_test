import type { Client, Deal, RegistryFilters, RegistryRecord, FormError } from '@/types/crm';

export function filterRecords(records: RegistryRecord[], filters: RegistryFilters) {
  const query = filters.search.toLocaleLowerCase('ru');
  return records.filter((record) => {
    if ('amount' in record)
      return (
        record.number.toLowerCase().includes(query) &&
        record.date >= filters.from &&
        record.date <= filters.to &&
        (!filters.client || record.client_id === Number(filters.client))
      );
    return `${record.name} ${record.code}`.toLocaleLowerCase('ru').includes(query);
  });
}

export function validateRecord(
  record: RegistryRecord,
  clients: Client[],
  deals: Deal[],
): FormError | undefined {
  if ('code' in record) {
    if (!record.name || !record.code) return { message: 'Заполните название и код.' };
    if (
      clients.some((c) => c.id !== record.id && c.code.toLowerCase() === record.code.toLowerCase())
    )
      return {
        message: 'Клиент с таким кодом уже существует.',
        fieldErrors: { code: 'Клиент с таким кодом уже существует.' },
      };
  } else {
    if (
      !record.number ||
      !clients.some((c) => c.id === record.client_id) ||
      !Number.isFinite(record.amount) ||
      record.amount <= 0
    )
      return { message: 'Проверьте обязательные поля.' };
    if (deals.some((d) => d.id !== record.id && d.number === record.number))
      return {
        message: 'Сделка с таким номером уже существует.',
        fieldErrors: { number: 'Сделка с таким номером уже существует.' },
      };
  }
}
