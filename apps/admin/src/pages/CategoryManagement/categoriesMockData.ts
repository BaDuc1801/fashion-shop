import dayjs, { Dayjs } from 'dayjs';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productsCount: number;
  createdAt: Dayjs;
  status: 'active' | 'inactive';
}

export const categories: Category[] = [
  {
    id: 'cat1',
    name: 'Áo thun',
    slug: 'ao-thun',
    icon: 'https://picsum.photos/seed/category1/80/80',
    productsCount: 58,
    createdAt: dayjs('2025-03-12'),
    status: 'active',
  },
  {
    id: 'cat2',
    name: 'Quần jean',
    slug: 'quan-jean',
    icon: 'https://picsum.photos/seed/category2/80/80',
    productsCount: 34,
    createdAt: dayjs('2025-05-08'),
    status: 'active',
  },
  {
    id: 'cat3',
    name: 'Phụ kiện',
    slug: 'phu-kien',
    icon: 'https://picsum.photos/seed/category3/80/80',
    productsCount: 19,
    createdAt: dayjs('2025-09-20'),
    status: 'inactive',
  },
];
