import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { productService, resolveImageUrls } from '@shared';
import type { AddNewProductFormValues } from '../schemas/addNewProductSchema';
import { useHexColorPayload } from './useHexColorPayload';

type UseUpdateProductParams = {
  productId?: string;
  currentSku?: string;
};

export const useUpdateProduct = ({
  productId,
  currentSku,
}: UseUpdateProductParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { normalizeHexColor } = useHexColorPayload();

  return useMutation({
    mutationFn: async (values: AddNewProductFormValues) => {
      if (!productId) {
        throw new Error('Missing product id');
      }

      const imageUrls = await resolveImageUrls(values.images);
      return productService.updateProduct(productId, {
        name: values.name,
        sku: values.sku,
        price: values.price,
        status: values.status ? 'active' : 'inactive',
        images: imageUrls,
        sizeVariants: values.sizeVariants.map((sv) => ({
          ...sv,
          colors: sv.colors.map((color) => ({
            ...color,
            name: normalizeHexColor(color.name),
          })),
        })),
      });
    },
    onSuccess: async (updatedProduct) => {
      message.success(t('admin.confirmModal.updateSuccess'));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['products'] }),
        queryClient.invalidateQueries({
          queryKey: ['products', 'detail-list'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['products', 'detail-by-sku', currentSku],
        }),
      ]);
    },
    onError: () => {
      message.error(t('admin.product.form.updateFailed'));
    },
  });
};
