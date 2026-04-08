import dayjs from 'dayjs';

export type OrderStatus = 'pending' | 'completed' | 'shipping' | 'cancelled';

export type OrderLineItem = {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  thumbnail?: string;
};

export type Order = {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  placedAt: ReturnType<typeof dayjs>;
  items: OrderLineItem[];
};

export const orders: Order[] = [
  {
    id: 'ORD-3001',
    customerName: 'Nguyen Van A',
    total: 189.9,
    status: 'completed',
    placedAt: dayjs().subtract(2, 'hour'),
    items: [
      {
        id: 'li-3001-1',
        productName: 'Basic Cotton T-Shirt',
        sku: 'TS-BASIC-WHT-M',
        quantity: 2,
        unitPrice: 24.95,
        thumbnail:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop',
      },
      {
        id: 'li-3001-2',
        productName: 'Slim Chino Pants',
        sku: 'PN-CHINO-NVY-32',
        quantity: 1,
        unitPrice: 140.0,
        thumbnail:
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=120&h=120&fit=crop',
      },
    ],
  },
  {
    id: 'ORD-3002',
    customerName: 'Tran Thi B',
    total: 64.5,
    status: 'pending',
    placedAt: dayjs().subtract(5, 'hour'),
    items: [
      {
        id: 'li-3002-1',
        productName: 'Winter Hoodie',
        sku: 'HD-WIN-BLK-L',
        quantity: 1,
        unitPrice: 64.5,
        thumbnail:
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=120&h=120&fit=crop',
      },
    ],
  },
  {
    id: 'ORD-3003',
    customerName: 'Le Van C',
    total: 287.95,
    status: 'shipping',
    placedAt: dayjs().subtract(1, 'day'),
    items: [
      {
        id: 'li-3003-1',
        productName: 'Regular Fit Jeans',
        sku: 'JN-REG-BLU-34',
        quantity: 2,
        unitPrice: 89.0,
        thumbnail:
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=120&h=120&fit=crop',
      },
      {
        id: 'li-3003-2',
        productName: 'Basic Cotton T-Shirt',
        sku: 'TS-BASIC-BLK-M',
        quantity: 1,
        unitPrice: 24.95,
        thumbnail:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop',
      },
      {
        id: 'li-3003-3',
        productName: 'Leather Belt',
        sku: 'AC-BELT-BRN-OS',
        quantity: 2,
        unitPrice: 42.5,
      },
    ],
  },
  {
    id: 'ORD-3004',
    customerName: 'Pham Minh D',
    total: 98.0,
    status: 'cancelled',
    placedAt: dayjs().subtract(2, 'day'),
    items: [
      {
        id: 'li-3004-1',
        productName: 'Slim Chino Pants',
        sku: 'PN-CHINO-KHK-30',
        quantity: 1,
        unitPrice: 98.0,
        thumbnail:
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=120&h=120&fit=crop',
      },
    ],
  },
  {
    id: 'ORD-3005',
    customerName: 'Hoang Thi E',
    total: 445.75,
    status: 'completed',
    placedAt: dayjs().subtract(3, 'day'),
    items: [
      {
        id: 'li-3005-1',
        productName: 'Winter Hoodie',
        sku: 'HD-WIN-GRY-M',
        quantity: 1,
        unitPrice: 129.0,
        thumbnail:
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=120&h=120&fit=crop',
      },
      {
        id: 'li-3005-2',
        productName: 'Regular Fit Jeans',
        sku: 'JN-REG-BLU-32',
        quantity: 2,
        unitPrice: 89.0,
        thumbnail:
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=120&h=120&fit=crop',
      },
      {
        id: 'li-3005-3',
        productName: 'Canvas Sneakers',
        sku: 'SN-CVS-WHT-42',
        quantity: 1,
        unitPrice: 138.75,
      },
    ],
  },
];
