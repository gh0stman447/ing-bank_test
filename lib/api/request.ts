import 'server-only';
import { z } from 'zod';

export const idSchema = z
  .string()
  .regex(/^\d+$/, 'Некорректный ID.')
  .transform(Number)
  .pipe(z.number().int().min(1).max(2147483647));

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
