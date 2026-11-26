import { createClient } from '@/lib/clients';
import { clientSchema } from '@/lib/validation/client';
import { errorResponse } from '@/lib/api/errors';

export async function POST(request: Request) {
  try {
    const data = clientSchema.parse(await request.json());
    const client = await createClient(data);
    return Response.json(client, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
