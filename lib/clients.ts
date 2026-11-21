import 'server-only';
import { getDb } from './db';
import type { Client } from '@/types/crm';
import type { ClientInput } from './validation/client';

export async function getClients() {
  const result = await getDb().query<Client>('SELECT id, name, code FROM clients ORDER BY id');
  return result.rows;
}

export async function createClient({ name, code }: ClientInput) {
  const result = await getDb().query<Client>(
    'INSERT INTO clients (name, code) VALUES ($1, $2) RETURNING id, name, code',
    [name, code],
  );
  return result.rows[0];
}

export async function updateClient(id: number, { name, code }: ClientInput) {
  const result = await getDb().query<Client>(
    'UPDATE clients SET name = $1, code = $2 WHERE id = $3 RETURNING id, name, code',
    [name, code, id],
  );
  return result.rows[0];
}

export async function deleteClient(id: number) {
  const result = await getDb().query('DELETE FROM clients WHERE id = $1', [id]);
  return result.rowCount === 1;
}
