import { requireUser } from '@/lib/auth';
import { updateClient, deleteClient } from '@/lib/clients';
import { clientSchema } from '@/lib/validation/client';
import { errorResponse } from '@/lib/api/errors';
import { idSchema, isSameOrigin } from '@/lib/api/request';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  if (!isSameOrigin(request))
    return Response.json({ error: 'Запрос с другого сайта запрещён.' }, { status: 403 });
  try {
    await requireUser();
    const id = idSchema.parse((await params).id);
    const data = clientSchema.parse(await request.json());
    const client = await updateClient(id, data);
    if (!client) return Response.json({ error: 'Запись не найдена.' }, { status: 404 });
    return Response.json(client);
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
    const deleted = await deleteClient(id);
    if (!deleted) return Response.json({ error: 'Запись не найдена.' }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
