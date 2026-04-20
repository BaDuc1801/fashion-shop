import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, InputNumber, message, Switch, Tabs } from 'antd';
import type { UploadFile } from 'antd';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
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

  const handleError = (errors: FieldErrors<CategoryFormValues>) => {
    const fields = Object.keys(errors);

    const hasViError = fields.some((f) => ['name'].includes(f));

    const hasEnError = fields.some((f) => ['nameEn'].includes(f));

    if (hasViError || hasEnError) {
      message.error(t('requiredBothLanguages'));
    }
  };

  const handleFinish = async (values: CategoryFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <FormProvider {...form}>
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFinish, handleError)}
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
        <Tabs
          defaultActiveKey="en"
          items={[
            {
              key: 'en',
              label: t('english'),
              children: (
                <FormItem name="nameEn" label={t('categoryNameEn')}>
                  <Input
                    placeholder={t('admin.category.form.placeholderName')}
                    size="large"
                  />
                </FormItem>
              ),
            },
            {
              key: 'vi',
              label: t('vietnamese'),
              children: (
                <FormItem name="name" label={t('categoryName')}>
                  <Input
                    placeholder={t('admin.category.form.placeholderName')}
                    size="large"
                  />
                </FormItem>
              ),
            },
          ]}
        ></Tabs>
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
          disabled={!form.formState.isDirty}
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
