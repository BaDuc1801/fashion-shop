import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createAddNewEmployeeSchema = (t: TFunction) =>
  z.object({
    id: z.string(),
    name: z.string().min(1, t('admin.validation.requiredName')),
    email: z.email(t('admin.validation.invalidEmail')),
    phone: z.string().min(1, t('admin.validation.requiredPhone')),
    joinDate: z.custom<dayjs.Dayjs>(
      (value) => dayjs.isDayjs(value),
      t('admin.validation.selectDate'),
    ),
    salary: z.number().min(0, t('admin.validation.salaryMin')),
    avatar: z.string(),
    status: z.boolean(),
    role: z.literal('staff'),
  });

export const addNewEmployeeSchemaDefaultValues = {
  id: '',
  name: '',
  email: '',
  phone: '',
  joinDate: undefined as unknown as dayjs.Dayjs,
  salary: 0,
  avatar: '' as string,
  status: true,
  role: 'staff' as const,
};

export type AddNewEmployeeFormValues = z.infer<
  ReturnType<typeof createAddNewEmployeeSchema>
>;
