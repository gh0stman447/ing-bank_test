import 'server-only';
import { z } from 'zod';

export const idSchema = z
  .string()
  .regex(/^\d+$/, 'Некорректный ID.')
  .transform(Number)
  .pipe(z.number().int().min(1).max(2147483647));

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return origin === new URL(process.env.APP_URL || request.url).origin;
  } catch {
    return false;
  }
}
