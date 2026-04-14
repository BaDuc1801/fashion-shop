import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, InputNumber, Switch } from 'antd';
import type { UploadFile } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormItem, ImageUploader, type Category } from '@shared';
import { useCategoryDetail } from './hooks/useCategoryDetail';
import {
  categoryFormSchemaDefaultValues,
  createCategoryFormSchema,
  type CategoryFormValues,
} from './schemas/categoryFormSchema';

interface CategoryFormProps {
  initialValues?: Category;
  isEdit?: boolean;
  showTitle?: boolean;
  submitting?: boolean;
  onSubmit?: (values: CategoryFormValues) => void | Promise<void>;
}

const CategoryForm = ({
  initialValues,
  isEdit,
  showTitle = true,
  submitting = false,
  onSubmit,
}: CategoryFormProps) => {
  const { t } = useTranslation();
  const categorySchema = createCategoryFormSchema(t);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: 'onSubmit',
    defaultValues: categoryFormSchemaDefaultValues,
  });
  const { handleSubmit, reset } = form;

  useCategoryDetail({ initialValues, reset });

  const handleFinish = async (values: CategoryFormValues) => {
    await onSubmit?.(values);
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
              onChange={(fileList) => field.onChange(fileList.slice(0, 1))}
              maxCount={1}
              uploadLabel={t('admin.category.form.upload')}
              multiple
            />
          )}
        </FormItem>
        <FormItem name="name" label={t('admin.category.form.name')}>
          <Input
            placeholder={t('admin.category.form.placeholderName')}
            size="large"
          />
        </FormItem>
        <FormItem name="slug" label={t('admin.category.form.slug')}>
          <Input
            placeholder={t('admin.category.form.placeholderSlug')}
            size="large"
          />
        </FormItem>
        <FormItem
          name="productCount"
          label={t('admin.category.form.productCount')}
        >
          <InputNumber size="large" disabled />
        </FormItem>
        <FormItem
          name="status"
          label={t('admin.category.form.active')}
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={submitting}
        >
          {isEdit
            ? t('admin.category.form.submitUpdate')
            : t('admin.category.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default CategoryForm;
