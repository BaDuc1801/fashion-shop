import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createUserFormSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('admin.validation.requiredName')),
    email: z.email(t('admin.validation.invalidEmail')),
    phone: z
      .string()
      .min(1, t('admin.validation.requiredPhone'))
      .regex(/^\d{9,15}$/, t('admin.validation.phoneDigits')),
    status: z.boolean(),
  });

export const userFormSchemaDefaultValues = {
  name: '',
  email: '',
  phone: '',
  status: true,
};

export type UserFormValues = z.infer<ReturnType<typeof createUserFormSchema>>;
