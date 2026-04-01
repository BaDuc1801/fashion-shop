export type ProductReview = {
  id: string;
  productId: string;
  userName: string;
  avatarUrl: string;
  rating: number;
  createdAt: string;
  comment: string;
  images?: string[];
  verifiedPurchase?: boolean;
};

const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'rv-1',
    productId: 'men-1',
    userName: 'Alex Nguyen',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    createdAt: '2026-02-14',
    comment:
      'Fabric is soft and breathable. Fit is true to size and the stitching quality is better than expected.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=320&q=80',
    ],
    verifiedPurchase: true,
  },
  {
    id: 'rv-2',
    productId: 'men-1',
    userName: 'Minh Tran',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    createdAt: '2026-02-10',
    comment:
      'Looks exactly like product images. Delivery was fast. I would buy another color next month.',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=320&q=80',
    ],
    verifiedPurchase: true,
  },
  {
    id: 'rv-7',
    productId: 'men-1',
    userName: 'Quang Bui',
    avatarUrl:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    createdAt: '2026-01-30',
    comment: 'Great fit and color. I wore it for travel and it felt very comfortable all day.',
    images: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=320&q=80',
    ],
    verifiedPurchase: true,
  },
  {
    id: 'rv-8',
    productId: 'men-1',
    userName: 'Huy Dang',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    createdAt: '2026-01-22',
    comment: 'Quality is good for this price range. Sleeve length is just right for me.',
    verifiedPurchase: false,
  },
  {
    id: 'rv-3',
    productId: 'women-3',
    userName: 'Linh Hoang',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    createdAt: '2026-01-28',
    comment:
      'Very comfortable for daily wear. The material keeps shape well after washing.',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
    ],
    verifiedPurchase: false,
  },
  {
    id: 'rv-4',
    productId: 'women-3',
    userName: 'Thu Pham',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    createdAt: '2026-01-20',
    comment:
      'Design is beautiful and minimal. The size runs slightly small for me, so consider sizing up.',
    images: [
      'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=320&q=80',
    ],
    verifiedPurchase: true,
  },
  {
    id: 'rv-5',
    productId: 'kids-2',
    userName: 'Bao Le',
    avatarUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    createdAt: '2026-03-05',
    comment:
      'Color and quality are both great. My kid likes it and says it is very comfy.',
    verifiedPurchase: true,
  },
  {
    id: 'rv-6',
    productId: 'kids-2',
    userName: 'Thanh Vo',
    avatarUrl:
      'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    createdAt: '2026-03-01',
    comment:
      'Good value for price. Fabric is not too thick so it is suitable for warm weather.',
    verifiedPurchase: false,
  },
];

const fallbackReviews: ProductReview[] = [
  {
    id: 'fallback-1',
    productId: 'generic',
    userName: 'Jamie Lee',
    avatarUrl:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    createdAt: '2026-02-02',
    comment: 'Excellent quality and comfortable fit. Highly recommended.',
    images: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=320&q=80',
    ],
    verifiedPurchase: true,
  },
  {
    id: 'fallback-2',
    productId: 'generic',
    userName: 'Chris Kim',
    avatarUrl:
      'https://images.unsplash.com/photo-1542204625-de293a71bde9?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    createdAt: '2026-01-18',
    comment: 'Nice design. The product matches the description and images.',
    verifiedPurchase: true,
  },
  {
    id: 'fallback-3',
    productId: 'generic',
    userName: 'Mai Vu',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    createdAt: '2026-01-13',
    comment: 'The quality surprised me in a good way. I will order one more for my sister.',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=320&q=80',
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=320&q=80',
    ],
    verifiedPurchase: true,
  },
  {
    id: 'fallback-4',
    productId: 'generic',
    userName: 'Duy Le',
    avatarUrl:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    createdAt: '2026-01-06',
    comment: 'Product is good and comfortable. Packaging was also clean and secure.',
    verifiedPurchase: false,
  },
  {
    id: 'fallback-5',
    productId: 'generic',
    userName: 'An Tran',
    avatarUrl:
      'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    createdAt: '2025-12-28',
    comment: 'Fast shipping and accurate description. Customer support was responsive too.',
    verifiedPurchase: true,
  },
  {
    id: 'fallback-6',
    productId: 'generic',
    userName: 'Nhi Pham',
    avatarUrl:
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    createdAt: '2025-12-20',
    comment: 'Material is nice and easy to clean. Fits with many styles.',
    verifiedPurchase: true,
  },
];

export const getMockReviewsByProductId = (productId: string) => {
  const reviews = MOCK_REVIEWS.filter((review) => review.productId === productId);
  return reviews.length ? reviews : fallbackReviews;
};
