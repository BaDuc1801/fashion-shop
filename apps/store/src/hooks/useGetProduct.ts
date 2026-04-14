import { useQuery } from '@tanstack/react-query';
import { GetProductsRequest, productService } from '@shared';

export const useGetProduct = (params: GetProductsRequest) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
  return { data, isLoading, error };
};
