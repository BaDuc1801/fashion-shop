import dayjs, { Dayjs } from 'dayjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Dayjs;
  avatar: { url: string; name: string };
  status: 'active' | 'inactive';
  purchaseHistory: {
    orderId: string;
    purchasedAt: Dayjs;
    totalAmount: number;
    status: 'completed' | 'cancelled' | 'shipping';
    items: {
      productName: string;
      quantity: number;
      unitPrice: number;
    }[];
  }[];
}

export const users: User[] = [
  {
    id: 'u1',
    name: 'Nguyen Van A',
    email: 'vana@gmail.com',
    phone: '0901000001',
    joinDate: dayjs('2024-02-10'),
    avatar: { url: 'https://i.pravatar.cc/150?img=31', name: 'avatar-1.png' },
    status: 'active',
    purchaseHistory: [
      {
        orderId: 'ORD-1001',
        purchasedAt: dayjs('2026-01-20'),
        totalAmount: 89.5,
        status: 'completed',
        items: [
          { productName: 'Basic Cotton T-Shirt', quantity: 2, unitPrice: 19.9 },
          { productName: 'Regular Fit Jeans', quantity: 1, unitPrice: 49.7 },
        ],
      },
      {
        orderId: 'ORD-1055',
        purchasedAt: dayjs('2026-03-11'),
        totalAmount: 120,
        status: 'shipping',
        items: [
          { productName: 'Winter Hoodie', quantity: 1, unitPrice: 49 },
          { productName: 'Slim Chino Pants', quantity: 1, unitPrice: 35 },
          { productName: 'Classic White Shirt', quantity: 1, unitPrice: 36 },
        ],
      },
    ],
  },
  {
    id: 'u2',
    name: 'Tran Thi B',
    email: 'thib@gmail.com',
    phone: '0901000002',
    joinDate: dayjs('2024-06-01'),
    avatar: { url: 'https://i.pravatar.cc/150?img=32', name: 'avatar-2.png' },
    status: 'inactive',
    purchaseHistory: [
      {
        orderId: 'ORD-1090',
        purchasedAt: dayjs('2026-02-01'),
        totalAmount: 45.2,
        status: 'cancelled',
        items: [{ productName: 'Polo Shirt', quantity: 1, unitPrice: 45.2 }],
      },
    ],
  },
  {
    id: 'u3',
    name: 'Le Van C',
    email: 'vanc@gmail.com',
    phone: '0901000003',
    joinDate: dayjs('2025-01-15'),
    avatar: { url: 'https://i.pravatar.cc/150?img=33', name: 'avatar-3.png' },
    status: 'active',
    purchaseHistory: [
      {
        orderId: 'ORD-1111',
        purchasedAt: dayjs('2026-02-18'),
        totalAmount: 60,
        status: 'completed',
        items: [
          { productName: 'Cotton Shorts', quantity: 2, unitPrice: 20 },
          { productName: 'Cap', quantity: 1, unitPrice: 20 },
        ],
      },
      {
        orderId: 'ORD-1145',
        purchasedAt: dayjs('2026-04-03'),
        totalAmount: 150.75,
        status: 'completed',
        items: [
          { productName: 'Oversized Hoodie', quantity: 1, unitPrice: 65.75 },
          { productName: 'Denim Jacket', quantity: 1, unitPrice: 85 },
        ],
      },
    ],
  },
];
