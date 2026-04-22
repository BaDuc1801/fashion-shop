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

      const variants = await Promise.all(
        values.variants.map(async (variant) => {
          const imageUrls = await resolveImageUrls(variant.images || []);

          return {
            color: normalizeHexColor(variant.color),
            images: imageUrls,
            skus: variant.skus
              .filter((sku) => sku.size)
              .map((sku) => ({
                size: sku.size,
                quantity: sku.quantity ?? 0,
              })),
          };
        }),
      );

      return productService.updateProduct(productId, {
        name: values.name,
        nameEn: values.nameEn,
        descriptionEn: values.descriptionEn,
        description: values.description,
        categoryId: values.categoryId,
        sku: values.sku,
        price: values.price,
        status: values.status ? 'active' : 'inactive',
        variants,
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

        queryClient.invalidateQueries({
          queryKey: ['products', 'detail-by-sku', updatedProduct.sku],
        }),
      ]);
    },

    onError: () => {
      message.error(t('admin.product.form.updateFailed'));
    },
  });
};
