import dayjs, { Dayjs } from 'dayjs';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  createdAt: Dayjs;
  status: 'active' | 'inactive';
  thumbnail: string;
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Basic Cotton T-Shirt',
    sku: 'TSHIRT-001',
    price: 19.9,
    stock: 120,
    createdAt: dayjs('2025-03-01'),
    status: 'active',
    thumbnail: 'https://picsum.photos/seed/p1/80/80',
  },
  {
    id: 'p2',
    name: 'Regular Fit Jeans',
    sku: 'JEANS-012',
    price: 39.5,
    stock: 45,
    createdAt: dayjs('2025-01-12'),
    status: 'active',
    thumbnail: 'https://picsum.photos/seed/p2/80/80',
  },
  {
    id: 'p3',
    name: 'Winter Hoodie',
    sku: 'HOODIE-221',
    price: 49.0,
    stock: 0,
    createdAt: dayjs('2024-11-09'),
    status: 'inactive',
    thumbnail: 'https://picsum.photos/seed/p3/80/80',
  },
];
