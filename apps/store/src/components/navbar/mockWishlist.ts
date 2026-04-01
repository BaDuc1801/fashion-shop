export type WishlistItem = {
  id: string; // productId
  name: string;
  imageUrl: string;
  price: number;
};

export const mockWishlist: WishlistItem[] = [
  {
    id: 'women-1',
    name: 'Womens Denim Jacket (Blue)',
    imageUrl:
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&q=80',
    price: 229,
  },
  {
    id: 'men-2',
    name: 'Mens Essential Tee',
    imageUrl:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd7?auto=format&fit=crop&w=600&q=80',
    price: 79,
  },
  {
    id: 'kids-3',
    name: 'Kids Premium Hoodie (Red)',
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    price: 89,
  },
  {
    id: 'shoes-7',
    name: 'Shoes Lightweight Sneakers (White)',
    imageUrl:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    price: 299,
  },
  {
    id: 'bags-4',
    name: 'Bags Daily Tote Bag (Brown)',
    imageUrl:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    price: 199,
  },
];

