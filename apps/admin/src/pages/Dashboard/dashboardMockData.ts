import dayjs from 'dayjs';

export type DashboardSummary = {
  totalRevenue: number;
  revenueChangePercent: number;
  totalOrders: number;
  ordersChangePercent: number;
  totalUsers: number;
  usersChangePercent: number;
  totalProducts: number;
  productsChangePercent: number;
};

export type RecentOrder = {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  placedAt: ReturnType<typeof dayjs>;
};

export type TopProduct = {
  id: string;
  name: string;
  sold: number;
  revenue: number;
};

export type SalesByDay = {
  label: string;
  value: number;
};

export const dashboardSummary: DashboardSummary = {
  totalRevenue: 128_450.5,
  revenueChangePercent: 12.4,
  totalOrders: 1842,
  ordersChangePercent: 6.1,
  totalUsers: 5620,
  usersChangePercent: 3.8,
  totalProducts: 428,
  productsChangePercent: -0.5,
};

export const recentOrders: RecentOrder[] = [
  {
    id: 'ORD-2048',
    customer: 'Nguyen Van A',
    amount: 189.9,
    status: 'completed',
    placedAt: dayjs().subtract(2, 'hour'),
  },
  {
    id: 'ORD-2047',
    customer: 'Tran Thi B',
    amount: 64.5,
    status: 'pending',
    placedAt: dayjs().subtract(5, 'hour'),
  },
  {
    id: 'ORD-2046',
    customer: 'Le Van C',
    amount: 312.0,
    status: 'completed',
    placedAt: dayjs().subtract(1, 'day'),
  },
  {
    id: 'ORD-2045',
    customer: 'Pham Minh D',
    amount: 98.0,
    status: 'cancelled',
    placedAt: dayjs().subtract(1, 'day'),
  },
  {
    id: 'ORD-2044',
    customer: 'Hoang Thi E',
    amount: 445.75,
    status: 'completed',
    placedAt: dayjs().subtract(2, 'day'),
  },
];

export const topProducts: TopProduct[] = [
  { id: 'p1', name: 'Basic Cotton T-Shirt', sold: 420, revenue: 8358 },
  { id: 'p2', name: 'Regular Fit Jeans', sold: 312, revenue: 12324 },
  { id: 'p3', name: 'Winter Hoodie', sold: 198, revenue: 9702 },
  { id: 'p4', name: 'Slim Chino Pants', sold: 156, revenue: 7800 },
];

export const salesLast7Days: SalesByDay[] = [
  { label: 'T2', value: 8200 },
  { label: 'T3', value: 9100 },
  { label: 'T4', value: 7800 },
  { label: 'T5', value: 11200 },
  { label: 'T6', value: 10500 },
  { label: 'T7', value: 13200 },
  { label: 'CN', value: 11800 },
];
