import dayjs, { Dayjs } from 'dayjs';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  banner: string;
  productsCount: number;
  startDate: Dayjs;
  endDate: Dayjs;
  status: 'draft' | 'active' | 'expired' | 'inactive';
  featured: boolean;
}

export const collections: Collection[] = [
  {
    id: 'c1',
    name: 'Summer 2026',
    slug: 'summer-2026',
    banner: 'https://picsum.photos/seed/collection1/120/80',
    productsCount: 32,
    startDate: dayjs('2026-05-01'),
    endDate: dayjs('2026-08-31'),
    status: 'active',
    featured: true,
  },
  {
    id: 'c2',
    name: 'Street Essentials',
    slug: 'street-essentials',
    banner: 'https://picsum.photos/seed/collection2/120/80',
    productsCount: 18,
    startDate: dayjs('2026-01-01'),
    endDate: dayjs('2026-12-31'),
    status: 'active',
    featured: false,
  },
  {
    id: 'c3',
    name: 'Winter Layering',
    slug: 'winter-layering',
    banner: 'https://picsum.photos/seed/collection3/120/80',
    productsCount: 25,
    startDate: dayjs('2025-10-01'),
    endDate: dayjs('2026-01-31'),
    status: 'expired',
    featured: false,
  },
];
