import { categoryData, type CategoryItem } from './categoryData';

export type CategoryProduct = {
  id: string; // format: `${categoryId}-${number}`
  name: string;
  imageUrl: string; // ảnh chính
  galleryImages: string[]; // ảnh thumbnails
  description: string;
  price: number;
  compareAtPrice: number;
  discountPercent: number;
  isHot: boolean;
  sizes: Array<{ id: string; label: string }>;
  colors: Array<{ id: string; name: string; imageUrl: string }>;
};

const PRODUCT_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1520975661595-6459943f0a2f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1520975958221-3c2a1f9a0e1b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1528701800489-20dbf1b66f2a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80',
] as const;

// Auto mock: mỗi category 50 sản phẩm (đủ để test pagination/filter).
const hashToSeed = (value: string) => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h || 1;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T,>(rand: () => number, arr: readonly T[]) =>
  arr[Math.floor(rand() * arr.length)];

const COLOR_NAMES = ['Blue', 'Black', 'Red', 'Green', 'White', 'Brown'] as const;
const SIZE_LABELS = ['XS', 'S', 'M', 'L', 'XL'] as const;

const titleWords = [
  'Denim',
  'Essential',
  'Classic',
  'Urban',
  'Daily',
  'Minimal',
  'Soft',
  'Comfort',
  'Relaxed',
  'Sport',
  'Premium',
  'Lightweight',
] as const;

const itemWords = [
  'Jacket',
  'Tee',
  'Hoodie',
  'Shirt',
  'Joggers',
  'Shorts',
  'Dress',
  'Sneakers',
  'Bag',
  'Watch',
  'Belt',
  'Cardigan',
] as const;

const basePriceByCategory: Record<string, number> = {
  men: 120,
  women: 140,
  kids: 60,
  shoes: 220,
  bags: 180,
  accessories: 90,
  sportswear: 110,
  'new-arrivals': 200,
  sale: 70,
  essentials: 130,
};

const makeMockProduct = (category: CategoryItem, index: number): CategoryProduct => {
  const rand = mulberry32(hashToSeed(`${category.id}-${index}`));

  const imageUrl = PRODUCT_IMAGE_URLS[index % PRODUCT_IMAGE_URLS.length];
  const galleryImages = Array.from({ length: 5 }, (_, k) => {
    return PRODUCT_IMAGE_URLS[(index + k) % PRODUCT_IMAGE_URLS.length];
  });

  const base = basePriceByCategory[category.id] ?? 120;
  const price = base + Math.round(rand() * 400);
  const compareAtPrice = price + 30 + Math.round(rand() * 220);
  const discountPercent = Math.max(
    5,
    Math.min(70, Math.round(((compareAtPrice - price) / compareAtPrice) * 100)),
  );

  const isHot = rand() > 0.75;
  const color = pick(rand, COLOR_NAMES);
  const name = `${category.name} ${pick(rand, titleWords)} ${pick(rand, itemWords)} (${color})`;
  const description = `${name} — designed for everyday comfort and style.`;

  const sizes = SIZE_LABELS.slice(1).map((label) => ({
    id: `${category.id}-size-${label}`,
    label,
  }));

  const colors = Array.from({ length: 4 }, (_, cIdx) => {
    const cName = COLOR_NAMES[(index + cIdx) % COLOR_NAMES.length];
    const cImg = PRODUCT_IMAGE_URLS[(index + cIdx + 1) % PRODUCT_IMAGE_URLS.length];
    return {
      id: `${category.id}-color-${cName}-${index}`,
      name: cName,
      imageUrl: cImg,
    };
  });

  return {
    id: `${category.id}-${index}`,
    name,
    imageUrl,
    galleryImages,
    description,
    price,
    compareAtPrice,
    discountPercent,
    isHot,
    sizes,
    colors,
  };
};

export function buildMockCategoryProducts(
  categories: CategoryItem[],
  perCategory = 50,
): CategoryProduct[] {
  return categories.flatMap((c) =>
    Array.from({ length: perCategory }, (_, i) => makeMockProduct(c, i + 1)),
  );
}

// Auto mock: mỗi category 50 sản phẩm để test.
export const mockCategoryProducts: CategoryProduct[] = buildMockCategoryProducts(
  categoryData,
  50,
);

// (đã chuyển sang mockCategoryProducts ở trên)

export const _deprecated_manualList: CategoryProduct[] = [
  {
    id: 'men-1',
    name: 'Mens Denim Jacket (Blue)',
    imageUrl: PRODUCT_IMAGE_URLS[0],
    galleryImages: [
      PRODUCT_IMAGE_URLS[0],
      PRODUCT_IMAGE_URLS[1],
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[4],
    ],
    description: 'Denim jacket with a relaxed fit and everyday comfort.',
    price: 229,
    compareAtPrice: 299,
    discountPercent: 23,
    isHot: true,
    sizes: [
      { id: 'men-size-S', label: 'S' },
      { id: 'men-size-M', label: 'M' },
      { id: 'men-size-L', label: 'L' },
      { id: 'men-size-XL', label: 'XL' },
    ],
    colors: [
      { id: 'men-color-Blue-1', name: 'Blue', imageUrl: PRODUCT_IMAGE_URLS[0] },
      {
        id: 'men-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      { id: 'men-color-Red-1', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
      {
        id: 'men-color-Green-1',
        name: 'Green',
        imageUrl: PRODUCT_IMAGE_URLS[3],
      },
    ],
  },
  {
    id: 'men-2',
    name: 'Mens Essential Tee',
    imageUrl: PRODUCT_IMAGE_URLS[1],
    galleryImages: [
      PRODUCT_IMAGE_URLS[1],
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[4],
      PRODUCT_IMAGE_URLS[5],
    ],
    description: 'Soft cotton tee for daily wear.',
    price: 79,
    compareAtPrice: 109,
    discountPercent: 28,
    isHot: false,
    sizes: [
      { id: 'men-size-S', label: 'S' },
      { id: 'men-size-M', label: 'M' },
      { id: 'men-size-L', label: 'L' },
      { id: 'men-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'men-color-White-2',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
      {
        id: 'men-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      { id: 'men-color-Blue-2', name: 'Blue', imageUrl: PRODUCT_IMAGE_URLS[0] },
      { id: 'men-color-Red-2', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
    ],
  },
  {
    id: 'women-1',
    name: 'Womens Denim Jacket (Blue)',
    imageUrl: PRODUCT_IMAGE_URLS[0],
    galleryImages: [
      PRODUCT_IMAGE_URLS[0],
      PRODUCT_IMAGE_URLS[4],
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[7],
    ],
    description: 'Classic denim jacket with a modern cut.',
    price: 229,
    compareAtPrice: 299,
    discountPercent: 23,
    isHot: true,
    sizes: [
      { id: 'women-size-S', label: 'S' },
      { id: 'women-size-M', label: 'M' },
      { id: 'women-size-L', label: 'L' },
      { id: 'women-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'women-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'women-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      { id: 'women-color-Red-1', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
      {
        id: 'women-color-Green-1',
        name: 'Green',
        imageUrl: PRODUCT_IMAGE_URLS[3],
      },
    ],
  },
  {
    id: 'women-2',
    name: 'Womens Summer Dress',
    imageUrl: PRODUCT_IMAGE_URLS[4],
    galleryImages: [
      PRODUCT_IMAGE_URLS[4],
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[7],
      PRODUCT_IMAGE_URLS[8],
    ],
    description: 'Breezy dress for warm days and easy styling.',
    price: 259,
    compareAtPrice: 329,
    discountPercent: 21,
    isHot: false,
    sizes: [
      { id: 'women-size-S', label: 'S' },
      { id: 'women-size-M', label: 'M' },
      { id: 'women-size-L', label: 'L' },
      { id: 'women-size-XL', label: 'XL' },
    ],
    colors: [
      { id: 'women-color-Red-2', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
      {
        id: 'women-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'women-color-Blue-2',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'women-color-White-2',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
    ],
  },
  {
    id: 'kids-1',
    name: 'Kids Hoodie',
    imageUrl: PRODUCT_IMAGE_URLS[3],
    galleryImages: [
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[7],
      PRODUCT_IMAGE_URLS[8],
      PRODUCT_IMAGE_URLS[9],
      PRODUCT_IMAGE_URLS[10],
    ],
    description: 'Warm hoodie built for play and comfort.',
    price: 129,
    compareAtPrice: 169,
    discountPercent: 24,
    isHot: true,
    sizes: [
      { id: 'kids-size-S', label: 'S' },
      { id: 'kids-size-M', label: 'M' },
      { id: 'kids-size-L', label: 'L' },
      { id: 'kids-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'kids-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'kids-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      { id: 'kids-color-Red-1', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
      {
        id: 'kids-color-Green-1',
        name: 'Green',
        imageUrl: PRODUCT_IMAGE_URLS[3],
      },
    ],
  },
  {
    id: 'shoes-1',
    name: 'Everyday Sneakers',
    imageUrl: PRODUCT_IMAGE_URLS[7],
    galleryImages: [
      PRODUCT_IMAGE_URLS[7],
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[1],
      PRODUCT_IMAGE_URLS[0],
      PRODUCT_IMAGE_URLS[2],
    ],
    description: 'Lightweight sneakers for everyday wear.',
    price: 299,
    compareAtPrice: 399,
    discountPercent: 25,
    isHot: false,
    sizes: [
      { id: 'shoes-size-S', label: 'S' },
      { id: 'shoes-size-M', label: 'M' },
      { id: 'shoes-size-L', label: 'L' },
      { id: 'shoes-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'shoes-color-White-1',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
      {
        id: 'shoes-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'shoes-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      { id: 'shoes-color-Red-1', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
    ],
  },
  {
    id: 'bags-1',
    name: 'Daily Tote Bag',
    imageUrl: PRODUCT_IMAGE_URLS[9],
    galleryImages: [
      PRODUCT_IMAGE_URLS[9],
      PRODUCT_IMAGE_URLS[8],
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[4],
    ],
    description: 'Roomy tote bag with a clean minimalist look.',
    price: 199,
    compareAtPrice: 259,
    discountPercent: 23,
    isHot: true,
    sizes: [
      { id: 'bags-size-S', label: 'S' },
      { id: 'bags-size-M', label: 'M' },
      { id: 'bags-size-L', label: 'L' },
      { id: 'bags-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'bags-color-Brown-1',
        name: 'Brown',
        imageUrl: PRODUCT_IMAGE_URLS[5],
      },
      {
        id: 'bags-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'bags-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      { id: 'bags-color-Red-1', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
    ],
  },
  {
    id: 'accessories-1',
    name: 'Minimal Watch',
    imageUrl: PRODUCT_IMAGE_URLS[8],
    galleryImages: [
      PRODUCT_IMAGE_URLS[8],
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[1],
      PRODUCT_IMAGE_URLS[0],
    ],
    description: 'Clean design with an everyday strap.',
    price: 349,
    compareAtPrice: 449,
    discountPercent: 22,
    isHot: false,
    sizes: [
      { id: 'accessories-size-S', label: 'S' },
      { id: 'accessories-size-M', label: 'M' },
      { id: 'accessories-size-L', label: 'L' },
      { id: 'accessories-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'accessories-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'accessories-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'accessories-color-Red-1',
        name: 'Red',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
      {
        id: 'accessories-color-Green-1',
        name: 'Green',
        imageUrl: PRODUCT_IMAGE_URLS[3],
      },
    ],
  },
  {
    id: 'accessories-2',
    name: 'Leather Belt',
    imageUrl: PRODUCT_IMAGE_URLS[6],
    galleryImages: [
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[8],
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[4],
      PRODUCT_IMAGE_URLS[2],
    ],
    description: 'Durable belt with a classic buckle.',
    price: 149,
    compareAtPrice: 199,
    discountPercent: 25,
    isHot: true,
    sizes: [
      { id: 'accessories-size-S', label: 'S' },
      { id: 'accessories-size-M', label: 'M' },
      { id: 'accessories-size-L', label: 'L' },
      { id: 'accessories-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'accessories-color-Brown-2',
        name: 'Brown',
        imageUrl: PRODUCT_IMAGE_URLS[5],
      },
      {
        id: 'accessories-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'accessories-color-Blue-2',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'accessories-color-Red-2',
        name: 'Red',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
    ],
  },
  {
    id: 'sportswear-1',
    name: 'Training Tee',
    imageUrl: PRODUCT_IMAGE_URLS[2],
    galleryImages: [
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[1],
      PRODUCT_IMAGE_URLS[0],
      PRODUCT_IMAGE_URLS[4],
    ],
    description: 'Breathable fabric for workouts and runs.',
    price: 129,
    compareAtPrice: 169,
    discountPercent: 24,
    isHot: false,
    sizes: [
      { id: 'sportswear-size-S', label: 'S' },
      { id: 'sportswear-size-M', label: 'M' },
      { id: 'sportswear-size-L', label: 'L' },
      { id: 'sportswear-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'sportswear-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'sportswear-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'sportswear-color-Red-1',
        name: 'Red',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
      {
        id: 'sportswear-color-Green-1',
        name: 'Green',
        imageUrl: PRODUCT_IMAGE_URLS[3],
      },
    ],
  },
  {
    id: 'sportswear-2',
    name: 'Running Shorts',
    imageUrl: PRODUCT_IMAGE_URLS[5],
    galleryImages: [
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[4],
      PRODUCT_IMAGE_URLS[1],
    ],
    description: 'Lightweight shorts with a comfortable waistband.',
    price: 159,
    compareAtPrice: 209,
    discountPercent: 24,
    isHot: true,
    sizes: [
      { id: 'sportswear-size-S', label: 'S' },
      { id: 'sportswear-size-M', label: 'M' },
      { id: 'sportswear-size-L', label: 'L' },
      { id: 'sportswear-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'sportswear-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'sportswear-color-Blue-2',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'sportswear-color-Red-2',
        name: 'Red',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
      {
        id: 'sportswear-color-White-2',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
    ],
  },
  {
    id: 'new-arrivals-1',
    name: 'New Arrival Jacket',
    imageUrl: PRODUCT_IMAGE_URLS[4],
    galleryImages: [
      PRODUCT_IMAGE_URLS[4],
      PRODUCT_IMAGE_URLS[0],
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[7],
    ],
    description: 'Fresh seasonal outerwear with a modern look.',
    price: 399,
    compareAtPrice: 499,
    discountPercent: 20,
    isHot: true,
    sizes: [
      { id: 'new-arrivals-size-S', label: 'S' },
      { id: 'new-arrivals-size-M', label: 'M' },
      { id: 'new-arrivals-size-L', label: 'L' },
      { id: 'new-arrivals-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'new-arrivals-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'new-arrivals-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'new-arrivals-color-Red-1',
        name: 'Red',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
      {
        id: 'new-arrivals-color-Green-1',
        name: 'Green',
        imageUrl: PRODUCT_IMAGE_URLS[3],
      },
    ],
  },
  {
    id: 'new-arrivals-2',
    name: 'New Arrival Knit',
    imageUrl: PRODUCT_IMAGE_URLS[5],
    galleryImages: [
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[4],
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[1],
    ],
    description: 'Soft knit piece perfect for layering.',
    price: 219,
    compareAtPrice: 279,
    discountPercent: 22,
    isHot: false,
    sizes: [
      { id: 'new-arrivals-size-S', label: 'S' },
      { id: 'new-arrivals-size-M', label: 'M' },
      { id: 'new-arrivals-size-L', label: 'L' },
      { id: 'new-arrivals-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'new-arrivals-color-White-2',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
      {
        id: 'new-arrivals-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'new-arrivals-color-Blue-2',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'new-arrivals-color-Red-2',
        name: 'Red',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
    ],
  },
  {
    id: 'sale-1',
    name: 'Sale Basic Tee',
    imageUrl: PRODUCT_IMAGE_URLS[10],
    galleryImages: [
      PRODUCT_IMAGE_URLS[10],
      PRODUCT_IMAGE_URLS[1],
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[4],
    ],
    description: 'Discounted staple tee—simple and versatile.',
    price: 59,
    compareAtPrice: 99,
    discountPercent: 40,
    isHot: true,
    sizes: [
      { id: 'sale-size-S', label: 'S' },
      { id: 'sale-size-M', label: 'M' },
      { id: 'sale-size-L', label: 'L' },
      { id: 'sale-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'sale-color-White-1',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
      {
        id: 'sale-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'sale-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      { id: 'sale-color-Red-1', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
    ],
  },
  {
    id: 'sale-2',
    name: 'Sale Hoodie',
    imageUrl: PRODUCT_IMAGE_URLS[3],
    galleryImages: [
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[0],
      PRODUCT_IMAGE_URLS[1],
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[4],
    ],
    description: 'Cozy hoodie at a great price.',
    price: 169,
    compareAtPrice: 249,
    discountPercent: 32,
    isHot: false,
    sizes: [
      { id: 'sale-size-S', label: 'S' },
      { id: 'sale-size-M', label: 'M' },
      { id: 'sale-size-L', label: 'L' },
      { id: 'sale-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'sale-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'sale-color-Blue-2',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      { id: 'sale-color-Red-2', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
      {
        id: 'sale-color-Green-2',
        name: 'Green',
        imageUrl: PRODUCT_IMAGE_URLS[3],
      },
    ],
  },
  {
    id: 'essentials-1',
    name: 'Essentials Crewneck',
    imageUrl: PRODUCT_IMAGE_URLS[6],
    galleryImages: [
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[4],
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[2],
    ],
    description: 'Everyday crewneck with a clean silhouette.',
    price: 199,
    compareAtPrice: 239,
    discountPercent: 17,
    isHot: false,
    sizes: [
      { id: 'essentials-size-S', label: 'S' },
      { id: 'essentials-size-M', label: 'M' },
      { id: 'essentials-size-L', label: 'L' },
      { id: 'essentials-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'essentials-color-Black-1',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'essentials-color-White-1',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
      {
        id: 'essentials-color-Blue-1',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'essentials-color-Red-1',
        name: 'Red',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
    ],
  },
  {
    id: 'essentials-2',
    name: 'Essentials Joggers',
    imageUrl: PRODUCT_IMAGE_URLS[9],
    galleryImages: [
      PRODUCT_IMAGE_URLS[9],
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[7],
      PRODUCT_IMAGE_URLS[8],
    ],
    description: 'Comfort-first joggers for everyday wear.',
    price: 179,
    compareAtPrice: 219,
    discountPercent: 18,
    isHot: true,
    sizes: [
      { id: 'essentials-size-S', label: 'S' },
      { id: 'essentials-size-M', label: 'M' },
      { id: 'essentials-size-L', label: 'L' },
      { id: 'essentials-size-XL', label: 'XL' },
    ],
    colors: [
      {
        id: 'essentials-color-Blue-2',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
      {
        id: 'essentials-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'essentials-color-Red-2',
        name: 'Red',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
      {
        id: 'essentials-color-Green-2',
        name: 'Green',
        imageUrl: PRODUCT_IMAGE_URLS[3],
      },
    ],
  },
  {
    id: 'men-3',
    name: 'Mens Slim Fit Shirt',
    imageUrl: PRODUCT_IMAGE_URLS[2],
    galleryImages: [
      PRODUCT_IMAGE_URLS[2],
      PRODUCT_IMAGE_URLS[3],
      PRODUCT_IMAGE_URLS[4],
    ],
    description: 'Modern slim fit shirt for casual and formal wear.',
    price: 189,
    compareAtPrice: 249,
    discountPercent: 24,
    isHot: false,
    sizes: [
      { id: 'men-size-S', label: 'S' },
      { id: 'men-size-M', label: 'M' },
      { id: 'men-size-L', label: 'L' },
    ],
    colors: [
      {
        id: 'men-color-White-3',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
      { id: 'men-color-Blue-3', name: 'Blue', imageUrl: PRODUCT_IMAGE_URLS[0] },
    ],
  },
  {
    id: 'women-3',
    name: 'Women Blazer',
    imageUrl: PRODUCT_IMAGE_URLS[6],
    galleryImages: [
      PRODUCT_IMAGE_URLS[6],
      PRODUCT_IMAGE_URLS[5],
      PRODUCT_IMAGE_URLS[4],
    ],
    description: 'Elegant blazer for office and events.',
    price: 349,
    compareAtPrice: 429,
    discountPercent: 19,
    isHot: true,
    sizes: [
      { id: 'women-size-S', label: 'S' },
      { id: 'women-size-M', label: 'M' },
    ],
    colors: [
      {
        id: 'women-color-Black-3',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'women-color-White-3',
        name: 'White',
        imageUrl: PRODUCT_IMAGE_URLS[10],
      },
    ],
  },
  {
    id: 'kids-2',
    name: 'Kids T-Shirt',
    imageUrl: PRODUCT_IMAGE_URLS[1],
    galleryImages: [PRODUCT_IMAGE_URLS[1], PRODUCT_IMAGE_URLS[2]],
    description: 'Soft and colorful t-shirt for kids.',
    price: 79,
    compareAtPrice: 109,
    discountPercent: 28,
    isHot: false,
    sizes: [
      { id: 'kids-size-S', label: 'S' },
      { id: 'kids-size-M', label: 'M' },
    ],
    colors: [
      {
        id: 'kids-color-Yellow-2',
        name: 'Yellow',
        imageUrl: PRODUCT_IMAGE_URLS[2],
      },
      {
        id: 'kids-color-Blue-2',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
    ],
  },
  {
    id: 'shoes-2',
    name: 'Running Sneakers Pro',
    imageUrl: PRODUCT_IMAGE_URLS[3],
    galleryImages: [PRODUCT_IMAGE_URLS[3], PRODUCT_IMAGE_URLS[7]],
    description: 'High performance running shoes.',
    price: 399,
    compareAtPrice: 499,
    discountPercent: 20,
    isHot: true,
    sizes: [
      { id: 'shoes-size-M', label: 'M' },
      { id: 'shoes-size-L', label: 'L' },
    ],
    colors: [
      {
        id: 'shoes-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      { id: 'shoes-color-Red-2', name: 'Red', imageUrl: PRODUCT_IMAGE_URLS[2] },
    ],
  },
  {
    id: 'bags-2',
    name: 'Mini Crossbody Bag',
    imageUrl: PRODUCT_IMAGE_URLS[8],
    galleryImages: [PRODUCT_IMAGE_URLS[8], PRODUCT_IMAGE_URLS[9]],
    description: 'Compact and stylish crossbody bag.',
    price: 149,
    compareAtPrice: 199,
    discountPercent: 25,
    isHot: false,
    sizes: [{ id: 'bags-size-S', label: 'S' }],
    colors: [
      {
        id: 'bags-color-Pink-2',
        name: 'Pink',
        imageUrl: PRODUCT_IMAGE_URLS[4],
      },
      {
        id: 'bags-color-Black-2',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
    ],
  },
  {
    id: 'sportswear-3',
    name: 'Gym Tank Top',
    imageUrl: PRODUCT_IMAGE_URLS[2],
    galleryImages: [PRODUCT_IMAGE_URLS[2], PRODUCT_IMAGE_URLS[3]],
    description: 'Breathable tank for workouts.',
    price: 99,
    compareAtPrice: 139,
    discountPercent: 29,
    isHot: true,
    sizes: [
      { id: 'sportswear-size-S', label: 'S' },
      { id: 'sportswear-size-M', label: 'M' },
    ],
    colors: [
      {
        id: 'sportswear-color-Black-3',
        name: 'Black',
        imageUrl: PRODUCT_IMAGE_URLS[1],
      },
      {
        id: 'sportswear-color-Blue-3',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
    ],
  },
  {
    id: 'sale-3',
    name: 'Clearance Jeans',
    imageUrl: PRODUCT_IMAGE_URLS[0],
    galleryImages: [PRODUCT_IMAGE_URLS[0], PRODUCT_IMAGE_URLS[1]],
    description: 'Limited stock clearance item.',
    price: 129,
    compareAtPrice: 259,
    discountPercent: 50,
    isHot: true,
    sizes: [
      { id: 'sale-size-M', label: 'M' },
      { id: 'sale-size-L', label: 'L' },
    ],
    colors: [
      {
        id: 'sale-color-Blue-3',
        name: 'Blue',
        imageUrl: PRODUCT_IMAGE_URLS[0],
      },
    ],
  },
];

export const getMockProductsByCategory = (category: CategoryItem) => {
  return mockCategoryProducts.filter((p) => p.id.startsWith(`${category.id}-`));
};

export const getMockProductById = (productId: string) => {
  return mockCategoryProducts.find((p) => p.id === productId) ?? null;
};
