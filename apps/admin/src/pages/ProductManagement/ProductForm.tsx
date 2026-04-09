import { Button, Form, Input, InputNumber, Switch } from 'antd';
import type { UploadFile } from 'antd';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormItem } from '../../components/common/FormItem';
import ImageUploader from '../../components/common/ImageUploader';
import type { Product } from './productsMockData';
import {
  addNewProductSchemaDefaultValues,
  createAddNewProductSchema,
  type AddNewProductFormValues,
} from './schemas/addNewProductSchema';

interface ProductFormProps {
  initialValues?: Product;
  isEdit?: boolean;
  showTitle?: boolean;
}

const ProductForm = ({
  initialValues,
  isEdit,
  showTitle = true,
}: ProductFormProps) => {
  const { t } = useTranslation();
  const productSchema = createAddNewProductSchema(t);
  const form = useForm<AddNewProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: 'onSubmit',
    defaultValues: addNewProductSchemaDefaultValues,
  });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        sku: initialValues.sku,
        price: initialValues.price,
        stock: initialValues.stock,
        status: initialValues.status === 'active',
        images: initialValues.thumbnail
          ? [
              {
                uid: initialValues.id,
                name: initialValues.name,
                status: 'done',
                url: initialValues.thumbnail,
              },
            ]
          : [],
      });
    }
  }, [initialValues, reset]);

  const handleFinish = (values: AddNewProductFormValues) => {
    console.log('Product payload:', values);
  };

  return (
    <FormProvider {...form}>
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFinish)}
        className="max-w-2xl space-y-2"
      >
        {showTitle ? (
          <h2 className="text-xl font-semibold">
            {isEdit
              ? t('admin.product.form.editTitle')
              : t('admin.product.form.addTitle')}
          </h2>
        ) : null}

        <FormItem name="images" label={t('admin.product.form.images')}>
          {({ field }) => (
            <ImageUploader
              fileList={(field.value as UploadFile[]) || []}
              onChange={(fileList) => field.onChange(fileList.slice(0, 6))}
              maxCount={6}
              uploadLabel={t('admin.product.form.upload')}
              multiple
            />
          )}
        </FormItem>

        <FormItem name="name" label={t('admin.product.form.name')}>
          <Input placeholder={t('admin.product.form.placeholderName')} />
        </FormItem>

        <FormItem name="sku" label={t('admin.product.form.sku')}>
          <Input placeholder={t('admin.product.form.placeholderSku')} />
        </FormItem>

        <FormItem
          name="price"
          label={t('admin.product.form.price')}
          getValueFromEvent={(value) => (value as number | null) ?? 0}
        >
          <InputNumber min={0} className="w-full" />
        </FormItem>

        <FormItem
          name="stock"
          label={t('admin.product.form.stock')}
          getValueFromEvent={(value) => (value as number | null) ?? 0}
        >
          <InputNumber min={0} className="w-full" />
        </FormItem>

        <FormItem
          name="status"
          label={t('admin.product.form.active')}
          valuePropName="checked"
        >
          <Switch />
        </FormItem>

        <Button type="primary" htmlType="submit" block>
          {isEdit
            ? t('admin.product.form.submitUpdate')
            : t('admin.product.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default ProductForm;
