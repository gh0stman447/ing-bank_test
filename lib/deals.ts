import 'server-only';
import { getDb } from './db';
import type { Deal } from '@/types/crm';
import type { DealInput } from './validation/deal';

type DealRow = Omit<Deal, 'date' | 'amount'> & { date: string; amount: string };

function toDeal(row: DealRow): Deal {
  return { ...row, amount: Number(row.amount) };
}

export async function getDeals() {
  const result = await getDb().query<DealRow>(
    'SELECT id, date::text, number, amount, client_id, description FROM deals ORDER BY date DESC, id DESC',
  );
  return result.rows.map(toDeal);
}

export async function createDeal(deal: DealInput) {
  const result = await getDb().query<DealRow>(
    `INSERT INTO deals (date, number, amount, client_id, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, date::text, number, amount, client_id, description`,
    [deal.date, deal.number, deal.amount, deal.client_id, deal.description],
  );
  return toDeal(result.rows[0]);
}

export async function updateDeal(id: number, deal: DealInput) {
  const result = await getDb().query<DealRow>(
    `UPDATE deals SET date = $1, number = $2, amount = $3, client_id = $4, description = $5
     WHERE id = $6
     RETURNING id, date::text, number, amount, client_id, description`,
    [deal.date, deal.number, deal.amount, deal.client_id, deal.description, id],
  );
  return result.rows[0] ? toDeal(result.rows[0]) : undefined;
}

export async function deleteDeal(id: number) {
  const result = await getDb().query('DELETE FROM deals WHERE id = $1', [id]);
  return result.rowCount === 1;
}
