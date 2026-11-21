import { deleteSession } from '@/lib/auth';
import { isSameOrigin } from '@/lib/api/request';
import { errorResponse } from '@/lib/api/errors';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Запрос запрещён.' }, { status: 403 });

  try {
    await deleteSession();
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
