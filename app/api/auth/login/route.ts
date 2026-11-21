import { getDb } from '@/lib/db';
import { allowLogin, checkPassword, createSession, deleteSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validation/login';
import { isSameOrigin } from '@/lib/api/request';
import { errorResponse } from '@/lib/api/errors';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Запрос запрещён.' }, { status: 403 });

  try {
    const { email, password } = loginSchema.parse(await request.json());

    if (!(await allowLogin(email)))
      return Response.json(
        { error: 'Слишком много попыток. Попробуйте через 15 минут.' },
        { status: 429 },
      );

    const result = await getDb().query<{ id: number; password_hash: string }>(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email],
    );

    const user = result.rows[0];
    const valid = await checkPassword(
      password,
      user?.password_hash ?? `00000000000000000000000000000000:${'0'.repeat(128)}`,
    );

    if (!user || !valid)
      return Response.json({ error: 'Неверный email или пароль.' }, { status: 401 });

    await deleteSession();
    await createSession(user.id);
    await getDb().query('DELETE FROM login_attempts WHERE email = $1', [email]);

    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
