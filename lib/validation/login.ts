import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .email('Укажите корректный email.')
    .max(254, 'Не более 254 символов.')
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'Введите пароль.').max(256, 'Не более 256 символов.'),
});
