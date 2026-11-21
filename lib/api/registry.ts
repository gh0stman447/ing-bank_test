import type { Client, Deal, RegistryRecord, Section, FieldErrors } from '@/types/crm';

export class ApiError extends Error {
  constructor(
    message: string,
    public fieldErrors?: FieldErrors,
  ) {
    super(message);
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (response.status === 401) window.location.replace('/login');
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      body?.error ?? 'Не удалось выполнить запрос. Попробуйте ещё раз.',
      body?.fieldErrors,
    );
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export const loadRegistry = (signal?: AbortSignal) =>
  apiRequest<{ clients: Client[]; deals: Deal[] }>('/registry', { signal });

export const persistRecord = (section: Section, record: RegistryRecord, editing: boolean) =>
  apiRequest<RegistryRecord>(`/${section}${editing ? `/${record.id}` : ''}`, {
    method: editing ? 'PUT' : 'POST',
    body: JSON.stringify(record),
  });

export const removeRecord = (section: Section, id: number) =>
  apiRequest<void>(`/${section}/${id}`, { method: 'DELETE' });
