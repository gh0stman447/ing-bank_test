import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().trim().min(1, 'Укажите название.').max(160, 'Не более 160 символов.'),
  code: z
    .string()
    .trim()
    .min(1, 'Укажите код.')
    .max(40, 'Не более 40 символов.')
    .regex(/^[A-Za-zА-Яа-яЁё0-9_-]+$/, 'Код: буквы, цифры, дефис или подчёркивание.'),
});

export type ClientInput = z.infer<typeof clientSchema>;
