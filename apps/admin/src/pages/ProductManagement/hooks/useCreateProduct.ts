import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { productService, resolveImageUrls } from '@shared';
import type { AddNewProductFormValues } from '../schemas/addNewProductSchema';
import { useHexColorPayload } from './useHexColorPayload';

export const useCreateProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { normalizeHexColor } = useHexColorPayload();

  return useMutation({
    mutationFn: async (values: AddNewProductFormValues) => {
      const variants = await Promise.all(
        values.variants.map(async (variant) => {
          const imageUrls = await resolveImageUrls(variant.images || []);

          return {
            color: normalizeHexColor(variant.color),
            images: imageUrls,
            skus: variant.skus.map((sku) => ({
              size: sku.size,
              quantity: sku.quantity ?? 0,
            })),
          };
        }),
      );

      return productService.createProduct({
        name: values.name,
        nameEn: values.nameEn,
        description: values.description,
        descriptionEn: values.descriptionEn,
        categoryId: values.categoryId,
        sku: values.sku,
        price: values.price,
        status: values.status ? 'active' : 'inactive',
        variants,
      });
    },
    onSuccess: async (createdProduct) => {
      message.success(t('admin.product.form.createSuccess'));
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate(`/products/${createdProduct.sku}`);
    },
    onError: () => {
      message.error(t('admin.product.form.createFailed'));
    },
  });
};
