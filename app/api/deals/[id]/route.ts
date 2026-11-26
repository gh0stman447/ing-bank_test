import { updateDeal, deleteDeal } from '@/lib/deals';
import { dealSchema } from '@/lib/validation/deal';
import { idSchema } from '@/lib/api/request';
import { errorResponse } from '@/lib/api/errors';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  try {
    const id = idSchema.parse((await params).id);
    const data = dealSchema.parse(await request.json());
    const deal = await updateDeal(id, data);
    if (!deal) return Response.json({ error: 'Запись не найдена.' }, { status: 404 });
    return Response.json(deal);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const id = idSchema.parse((await params).id);
    const deleted = await deleteDeal(id);
    if (!deleted) return Response.json({ error: 'Запись не найдена.' }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
