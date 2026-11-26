import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSameOrigin } from '@/lib/api/request';
import { getUserBySessionToken, SESSION_COOKIE } from '@/lib/auth';
import { errorResponse } from '@/lib/api/errors';

export async function proxy(request: NextRequest) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && !isSameOrigin(request)) {
    return NextResponse.json({ error: 'Запрос с другого сайта запрещён.' }, { status: 403 });
  }

  try {
    const user = await getUserBySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!user) return NextResponse.json({ error: 'Войдите в аккаунт.' }, { status: 401 });
  } catch (error) {
    return errorResponse(error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/clients/:path*', '/api/deals/:path*', '/api/registry'],
};
