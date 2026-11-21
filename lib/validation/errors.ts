import type { ZodError } from 'zod';
import type { FieldErrors } from '@/types/crm';

export function getFieldErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '');
    if (field && !errors[field]) errors[field] = issue.message;
  }

  return errors;
}
