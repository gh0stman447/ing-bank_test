import { createDeal } from '@/lib/deals';
import { dealSchema } from '@/lib/validation/deal';
import { errorResponse } from '@/lib/api/errors';

export async function POST(request: Request) {
  try {
    const data = dealSchema.parse(await request.json());
    const deal = await createDeal(data);
    return Response.json(deal, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
