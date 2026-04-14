import { Product } from '@shared';

export const getProductCoverImage = (product: Product) => product.images?.[0];
