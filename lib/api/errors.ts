import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { UnauthorizedError } from '@/lib/auth';
import { ZodError } from 'zod';
import { getFieldErrors } from '@/lib/validation/errors';

export function errorResponse(error: unknown) {
  unstable_rethrow(error);

  if (error instanceof UnauthorizedError)
    return Response.json({ error: 'Войдите в аккаунт.' }, { status: 401 });

  if (error instanceof ZodError) {
    return Response.json(
      { error: error.issues[0].message, fieldErrors: getFieldErrors(error) },
      { status: 400 },
    );
  }

  if (error instanceof SyntaxError) {
    return Response.json({ error: 'Некорректный JSON.' }, { status: 400 });
  }

  const code = error instanceof Error && 'code' in error ? error.code : null;
  if (code === '23505') {
    const constraint =
      error instanceof Error && 'constraint' in error ? String(error.constraint) : '';
    const field = constraint.startsWith('clients_') ? 'code' : 'number';

    return Response.json(
      {
        error: 'Такой код или номер уже существует.',
        fieldErrors: { [field]: 'Такой код или номер уже существует.' },
      },
      { status: 409 },
    );
  }

  if (code === '23503') {
    return Response.json({ error: 'Клиент не найден или с ним связаны сделки.' }, { status: 409 });
  }

  console.error(error);
  return Response.json({ error: 'Не удалось выполнить запрос к базе данных.' }, { status: 503 });
}
