import dayjs, { Dayjs } from 'dayjs';

export interface Voucher {
  id: string;
  code: string;
  image?: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  expiresAt: Dayjs;
  status: 'active' | 'inactive';
}

export const vouchers: Voucher[] = [
  {
    id: 'v1',
    code: 'WELCOME10',
    image: 'https://picsum.photos/seed/voucher1/120/80',
    discountPercent: 10,
    maxDiscount: 10,
    minOrderValue: 50,
    expiresAt: dayjs('2026-12-31'),
    status: 'active',
  },
  {
    id: 'v2',
    code: 'SUMMER20',
    image: 'https://picsum.photos/seed/voucher2/120/80',
    discountPercent: 20,
    maxDiscount: 20,
    minOrderValue: 120,
    expiresAt: dayjs('2026-08-31'),
    status: 'active',
  },
  {
    id: 'v3',
    code: 'FLASH30',
    image: 'https://picsum.photos/seed/voucher3/120/80',
    discountPercent: 30,
    maxDiscount: 15,
    minOrderValue: 200,
    expiresAt: dayjs('2025-12-01'),
    status: 'inactive',
  },
];
