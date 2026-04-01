export type CartItem = {
  id: string; // productId
  name: string;
  imageUrl: string;
  categoryLabel: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
};

export const mockCartItems: CartItem[] = [
  {
    id: 'shoes-1',
    name: "Nike Air Max 95 Big Bubble 'OG'",
    imageUrl:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    categoryLabel: "Men's shoes",
    color: 'Black/White',
    size: '44.5',
    price: 499,
    quantity: 1,
  },
  {
    id: 'shoes-2',
    name: "Nike Air Force 1 '07",
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    categoryLabel: "Men's shoes",
    color: 'White/White',
    size: '47.5',
    price: 292,
    quantity: 1,
  },
];

