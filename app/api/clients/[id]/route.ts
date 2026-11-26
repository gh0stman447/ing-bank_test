import { updateClient, deleteClient } from '@/lib/clients';
import { clientSchema } from '@/lib/validation/client';
import { idSchema } from '@/lib/api/request';
import { errorResponse } from '@/lib/api/errors';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  try {
    const id = idSchema.parse((await params).id);
    const data = clientSchema.parse(await request.json());
    const client = await updateClient(id, data);
    if (!client) return Response.json({ error: 'Запись не найдена.' }, { status: 404 });
    return Response.json(client);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const id = idSchema.parse((await params).id);
    const deleted = await deleteClient(id);
    if (!deleted) return Response.json({ error: 'Запись не найдена.' }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
