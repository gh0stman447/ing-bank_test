import { z } from 'zod';

export const dealSchema = z.object({
  date: z.iso
    .date('Некорректная дата.')
    .refine((date) => date >= '0001-01-01', 'Некорректная дата.'),
  number: z.string().trim().min(1, 'Укажите номер сделки.').max(60, 'Не более 60 символов.'),
  amount: z
    .number()
    .positive('Сумма должна быть больше нуля.')
    .max(999999999999.99, 'Слишком большая сумма.')
    .refine(
      (amount) => Number(amount.toFixed(2)) === amount,
      'Укажите сумму с точностью до копеек.',
    ),
  client_id: z.number().int().min(1, 'Выберите клиента.').max(2147483647),
  description: z.string().trim().max(2000, 'Не более 2000 символов.').default(''),
});

export type DealInput = z.infer<typeof dealSchema>;
