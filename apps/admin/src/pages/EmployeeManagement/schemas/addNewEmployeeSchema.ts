import dayjs from 'dayjs';
import type { UploadFile } from 'antd';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createAddNewEmployeeSchema = (t: TFunction) =>
  z.object({
    _id: z.string(),
    name: z.string().min(1, t('admin.validation.requiredName')),
    email: z.email(t('admin.validation.invalidEmail')),
    phone: z.string().min(1, t('admin.validation.requiredPhone')),
    joinDate: z.custom<dayjs.Dayjs>(
      (value) => dayjs.isDayjs(value),
      t('admin.validation.selectDate'),
    ),
    salary: z.number().min(0, t('admin.validation.salaryMin')),
    avatar: z.array(z.custom<UploadFile>()),
    status: z.boolean(),
    role: z.enum(['admin', 'staff']),
  });

export const addNewEmployeeSchemaDefaultValues = {
  _id: '',
  name: '',
  email: '',
  phone: '',
  joinDate: undefined as unknown as dayjs.Dayjs,
  salary: 0,
  avatar: [] as UploadFile[],
  status: true,
  role: 'staff' as const,
};

export type AddNewEmployeeFormValues = z.infer<
  ReturnType<typeof createAddNewEmployeeSchema>
>;
