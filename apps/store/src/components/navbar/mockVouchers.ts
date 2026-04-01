export type Voucher = {
  id: string;
  code: string;
  description: string;
  imageUrl: string;
  type: 'percent' | 'fixed';
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
};

export const mockVouchers: Voucher[] = [
  {
    id: 'vc-free-ship',
    code: 'FREESHIP',
    description: 'Get $30 off shipping fee',
    imageUrl:
      'https://images.unsplash.com/photo-1556741533-974f8e62a92d?auto=format&fit=crop&w=220&q=80',
    type: 'fixed',
    value: 30,
    minOrderValue: 300,
  },
  {
    id: 'vc-save10',
    code: 'SAVE10',
    description: '10% off up to $150',
    imageUrl:
      'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=220&q=80',
    type: 'percent',
    value: 10,
    maxDiscount: 150,
    minOrderValue: 800,
  },
  {
    id: 'vc-save80',
    code: 'LESS80',
    description: '$80 off for orders from $1200',
    imageUrl:
      'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=220&q=80',
    type: 'fixed',
    value: 80,
    minOrderValue: 1200,
  },
];
