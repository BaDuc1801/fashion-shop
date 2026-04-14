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
      const imageUrls = await resolveImageUrls(values.images);
      return productService.createProduct({
        name: values.name,
        categoryId: values.categoryId,
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
