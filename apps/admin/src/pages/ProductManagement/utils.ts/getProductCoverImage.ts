import { Product } from '@shared';

export const getProductCoverImage = (product: Product) =>
  product.variants[0].images?.[0];
