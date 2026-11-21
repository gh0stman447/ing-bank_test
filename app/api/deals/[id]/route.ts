import { requireUser } from '@/lib/auth';
import { updateDeal, deleteDeal } from '@/lib/deals';
import { dealSchema } from '@/lib/validation/deal';
import { errorResponse } from '@/lib/api/errors';
import { idSchema, isSameOrigin } from '@/lib/api/request';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  if (!isSameOrigin(request))
    return Response.json({ error: 'Запрос с другого сайта запрещён.' }, { status: 403 });

  try {
    await requireUser();
    const id = idSchema.parse((await params).id);
    const data = dealSchema.parse(await request.json());
    const deal = await updateDeal(id, data);

    if (!deal) return Response.json({ error: 'Запись не найдена.' }, { status: 404 });

    return Response.json(deal);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!isSameOrigin(request))
    return Response.json({ error: 'Запрос с другого сайта запрещён.' }, { status: 403 });

  try {
    await requireUser();
    const id = idSchema.parse((await params).id);
    const deleted = await deleteDeal(id);

    if (!deleted) return Response.json({ error: 'Запись не найдена.' }, { status: 404 });

    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
