import { TFunction } from 'i18next';
import { z } from 'zod';

export interface OrderFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: string;
  voucherId?: string;
}

export const orderFormSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('requiredName')),
    email: z.string().email(t('invalidEmail')),
    phone: z.string().min(1, t('requiredPhone')),
    address: z.string().min(1, t('requiredAddress')),
    note: z.string().optional(),
    paymentMethod: z.string().min(1, t('requiredPaymentMethod')),
    voucherId: z.string().optional(),
  });

export const orderFormSchemaDefaultValues: OrderFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  note: '',
  paymentMethod: 'sepay',
  voucherId: '',
};
