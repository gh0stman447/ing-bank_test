import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/clients';
import { clientSchema } from '@/lib/validation/client';
import { errorResponse } from '@/lib/api/errors';
import { isSameOrigin } from '@/lib/api/request';

export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return Response.json({ error: 'Запрос с другого сайта запрещён.' }, { status: 403 });

  try {
    await requireUser();
    const data = clientSchema.parse(await request.json());
    const client = await createClient(data);

    return Response.json(client, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
