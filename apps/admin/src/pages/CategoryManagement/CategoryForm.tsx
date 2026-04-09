import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DatePicker, Form, Input, InputNumber, Switch } from 'antd';
import type { UploadFile } from 'antd';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormItem } from '../../components/common/FormItem';
import ImageUploader from '../../components/common/ImageUploader';
import type { Category } from './categoriesMockData';
import {
  categoryFormSchemaDefaultValues,
  createCategoryFormSchema,
  type CategoryFormValues,
} from './schemas/categoryFormSchema';

interface CategoryFormProps {
  initialValues?: Category;
  isEdit?: boolean;
  showTitle?: boolean;
}

const CategoryForm = ({
  initialValues,
  isEdit,
  showTitle = true,
}: CategoryFormProps) => {
  const { t } = useTranslation();
  const categorySchema = createCategoryFormSchema(t);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: 'onSubmit',
    defaultValues: categoryFormSchemaDefaultValues,
  });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        slug: initialValues.slug,
        productsCount: initialValues.productsCount,
        createdAt: initialValues.createdAt,
        status: initialValues.status === 'active',
        images: initialValues.icon
          ? [
              {
                uid: initialValues.id,
                name: initialValues.name,
                status: 'done',
                url: initialValues.icon,
              },
            ]
          : [],
      });
    }
  }, [initialValues, reset]);

  const handleFinish = (values: CategoryFormValues) => {
    console.log('Category payload:', values);
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
              ? t('admin.category.form.editTitle')
              : t('admin.category.form.addTitle')}
          </h2>
        ) : null}
        <FormItem name="images" label={t('admin.category.form.images')}>
          {({ field }) => (
            <ImageUploader
              fileList={(field.value as UploadFile[]) || []}
              onChange={(fileList) => field.onChange(fileList.slice(0, 3))}
              maxCount={1}
              uploadLabel={t('admin.category.form.upload')}
              multiple
            />
          )}
        </FormItem>
        <FormItem name="name" label={t('admin.category.form.name')}>
          <Input placeholder={t('admin.category.form.placeholderName')} />
        </FormItem>
        <FormItem name="slug" label={t('admin.category.form.slug')}>
          <Input placeholder={t('admin.category.form.placeholderSlug')} />
        </FormItem>
        <FormItem
          name="productsCount"
          label={t('admin.category.form.productsCount')}
          getValueFromEvent={(value) => (value as number | null) ?? 0}
        >
          <InputNumber min={0} className="w-full" />
        </FormItem>
        <FormItem name="createdAt" label={t('admin.category.form.createdAt')}>
          <DatePicker className="w-full" />
        </FormItem>
        <FormItem
          name="status"
          label={t('admin.category.form.active')}
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
        <Button type="primary" htmlType="submit" block>
          {isEdit
            ? t('admin.category.form.submitUpdate')
            : t('admin.category.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default CategoryForm;
