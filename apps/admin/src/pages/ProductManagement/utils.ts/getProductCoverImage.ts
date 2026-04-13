import { ProductResponse } from '@fashion-monorepo/shared';

export const getProductCoverImage = (product: ProductResponse) =>
  product.images?.[0];
