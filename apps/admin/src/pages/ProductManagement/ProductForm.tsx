import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Switch,
  Tabs,
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { FieldErrors, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryService, FormItem, Product } from '@shared';
import {
  addNewProductSchemaDefaultValues,
  createAddNewProductSchema,
  type AddNewProductFormValues,
} from './schemas/addNewProductSchema';
import { useProductDetail } from './hooks/useProductDetail';
import { VariantFields } from './components/VariantField';

const ProductForm = ({
  initialValues,
  isEdit,
  showTitle = true,
  submitting = false,
  onSubmit,
}: {
  initialValues?: Product;
  isEdit?: boolean;
  showTitle?: boolean;
  submitting?: boolean;
  onSubmit?: (values: AddNewProductFormValues) => void;
}) => {
  const { t, i18n } = useTranslation();

  const form = useForm<AddNewProductFormValues>({
    resolver: zodResolver(createAddNewProductSchema(t)),
    defaultValues: addNewProductSchemaDefaultValues,
  });

  const { handleSubmit, reset, control } = form;

  const { data, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories({ limit: 100 }),
  });

  useProductDetail({ initialValues, reset });

  const variantsWatch = useWatch({ control, name: 'variants' });

  const totalStock = useMemo(() => {
    return variantsWatch?.reduce((sum, v) => {
      return (
        sum + (v?.skus?.reduce((acc, s) => acc + (s.quantity || 0), 0) || 0)
      );
    }, 0);
  }, [variantsWatch]);

  const categoryOptions = data?.data?.map((c) => ({
    value: c._id,
    label: i18n.language === 'vi' ? c.name : c.nameEn,
  }));

  const handleError = (errors: FieldErrors<AddNewProductFormValues>) => {
    if (errors.name || errors.nameEn) {
      message.error('Name required');
    }
  };

  const handleFinish = async (values: AddNewProductFormValues) => {
    await onSubmit?.(values);
  };
  return (
    <FormProvider {...form}>
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFinish, handleError)}
        className="max-w-2xl space-y-3"
      >
        {showTitle && (
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Update Product' : 'Create Product'}
          </h2>
        )}

        <FormItem name="categoryId" label="Category">
          <Select
            showSearch
            optionFilterProp="label"
            options={categoryOptions}
            loading={isCategoriesLoading}
            placeholder={t('admin.product.form.placeholderCategory')}
            size="large"
          />
        </FormItem>

        <Tabs
          items={[
            {
              key: 'en',
              label: 'English',
              children: (
                <>
                  <FormItem name="nameEn" label="Name">
                    <Input />
                  </FormItem>
                  <FormItem name="descriptionEn" label="Description">
                    <Input.TextArea rows={4} />
                  </FormItem>
                </>
              ),
            },
            {
              key: 'vi',
              label: t('vietnamese'),
              children: (
                <>
                  <FormItem name="name" label={t('productName')}>
                    <Input
                      placeholder={t('admin.product.form.placeholderName')}
                      size="large"
                      className="mb-2"
                    />
                  </FormItem>

                  <FormItem name="description" label={t('description')}>
                    <Input.TextArea
                      placeholder={t(
                        'admin.product.form.placeholderDescription',
                      )}
                      size="large"
                      rows={5}
                    />
                  </FormItem>
                </>
              ),
            },
          ]}
        />

        <FormItem name="sku" label={t('admin.product.form.sku')}>
          <Input
            placeholder={t('admin.product.form.placeholderSku')}
            size="large"
          />
        </FormItem>

        <FormItem
          name="price"
          label={t('admin.product.form.price')}
          getValueFromEvent={(value) => (value as number | null) ?? 0}
        >
          <InputNumber min={0} className="w-full" size="large" />
        </FormItem>

        <Form.Item label={t('admin.product.form.totalStock')} className="mb-0">
          <InputNumber
            value={totalStock}
            disabled
            className="w-full"
            size="large"
          />
        </Form.Item>

        <div className="max-h-[500px] overflow-y-auto p-2 rounded-xl border border-slate-200">
          <VariantFields />
        </div>

        <FormItem
          name="status"
          label={t('admin.product.form.active')}
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
            ? t('admin.product.form.submitUpdate')
            : t('admin.product.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default ProductForm;
