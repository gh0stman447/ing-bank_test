import type { Column, RegistryFilters, Section } from '@/types/crm';

export const INITIAL_FILTERS: RegistryFilters = {
  search: '',
  client: '',
  from: '2026-11-01',
  to: '2026-11-30',
};

export const DEMO_DATE = '2026-11-19';
export const DEFAULT_PAGE_SIZE = 8;
export const PAGE_SIZES = [8, 16, 32] as const;

export const SECTIONS: Record<
  Section,
  {
    title: string;
    createLabel: string;
    listTitle: string;
    sortBy: string;
  }
> = {
  deals: {
    title: 'Реестр сделок',
    createLabel: 'Новая сделка',
    listTitle: 'Все сделки',
    sortBy: 'date',
  },
  clients: {
    title: 'Справочник клиентов',
    createLabel: 'Добавить клиента',
    listTitle: 'Все клиенты',
    sortBy: 'name',
  },
};

export const COLUMNS: Record<Section, Column[]> = {
  deals: [
    { key: 'number', label: 'Номер сделки' },
    { key: 'date', label: 'Дата' },
    { key: 'client_id', label: 'Клиент' },
    { key: 'amount', label: 'Сумма' },
    { key: 'description', label: 'Описание' },
    { key: 'id', label: 'ID' },
  ],
  clients: [
    { key: 'name', label: 'Название компании' },
    { key: 'code', label: 'Код клиента' },
    { key: 'id', label: 'ID' },
  ],
};
