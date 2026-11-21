import { requireUser } from '@/lib/auth';
import { createDeal } from '@/lib/deals';
import { dealSchema } from '@/lib/validation/deal';
import { errorResponse } from '@/lib/api/errors';
import { isSameOrigin } from '@/lib/api/request';

export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return Response.json({ error: 'Запрос с другого сайта запрещён.' }, { status: 403 });
  try {
    await requireUser();
    const data = dealSchema.parse(await request.json());
    const deal = await createDeal(data);
    return Response.json(deal, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
