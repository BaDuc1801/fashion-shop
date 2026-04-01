import { mockCategoryProducts } from '../category/categoryProductsData';

export type BestSellerProduct = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  isHot: boolean;
};

export type BestSellerTab = {
  key: string;
  label: string;
  products: BestSellerProduct[];
};

const toBestSellerProduct = (p: {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  isHot: boolean;
}): BestSellerProduct => ({
  id: p.id,
  name: p.name,
  imageUrl: p.imageUrl,
  price: p.price,
  isHot: p.isHot,
});

const byCategoryPrefix = (prefix: string) =>
  mockCategoryProducts
    .filter((p) => p.id.startsWith(prefix))
    .map(toBestSellerProduct);

export const bestSellerTabs: BestSellerTab[] = [
  { key: '1', label: 'Men', products: byCategoryPrefix('men-') },
  { key: '2', label: 'Women', products: byCategoryPrefix('women-') },
  { key: '3', label: 'Kids', products: byCategoryPrefix('kids-') },
];
