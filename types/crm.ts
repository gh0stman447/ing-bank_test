export type Section = 'deals' | 'clients';

export interface Client {
  id: number;
  name: string;
  code: string;
}

export interface Deal {
  id: number;
  date: string;
  number: string;
  amount: number;
  client_id: number;
  description: string;
}

export interface Column {
  key: string;
  label: string;
}

export type RegistryRecord = Client | Deal;

export interface RegistryFilters {
  search: string;
  client: string;
  from: string;
  to: string;
}
export interface RecordFormState {
  record?: RegistryRecord;
  readOnly: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export type FieldErrors = Record<string, string>;
export interface FormError {
  message: string;
  fieldErrors?: FieldErrors;
}
