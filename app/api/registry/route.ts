import { requireUser } from '@/lib/auth';
import { getClients } from '@/lib/clients';
import { getDeals } from '@/lib/deals';
import { errorResponse } from '@/lib/api/errors';

export async function GET() {
  try {
    await requireUser();
    const [clients, deals] = await Promise.all([getClients(), getDeals()]);
    return Response.json({ clients, deals }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error);
  }
}
