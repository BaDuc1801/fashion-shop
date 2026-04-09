import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd';
import type { UploadFile } from 'antd';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormItem } from '../../components/common/FormItem';
import ImageUploader from '../../components/common/ImageUploader';
import type { Collection } from './collectionsMockData';
import {
  collectionFormSchemaDefaultValues,
  createCollectionFormSchema,
  type CollectionFormValues,
} from './schemas/collectionFormSchema';

interface CollectionFormProps {
  initialValues?: Collection;
  isEdit?: boolean;
  showTitle?: boolean;
}

const CollectionForm = ({
  initialValues,
  isEdit,
  showTitle = true,
}: CollectionFormProps) => {
  const { t } = useTranslation();
  const collectionSchema = createCollectionFormSchema(t);
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    mode: 'onSubmit',
    defaultValues: collectionFormSchemaDefaultValues,
  });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        slug: initialValues.slug,
        images: initialValues.banner
          ? [
              {
                uid: initialValues.id,
                name: initialValues.name,
                status: 'done',
                url: initialValues.banner,
              },
            ]
          : [],
        productsCount: initialValues.productsCount,
        startDate: initialValues.startDate,
        endDate: initialValues.endDate,
        status: initialValues.status,
        featured: initialValues.featured,
      });
    }
  }, [initialValues, reset]);

  const handleFinish = (values: CollectionFormValues) => {
    console.log('Collection payload:', values);
  };

  const statusOptions = [
    { value: 'draft' as const, label: t('admin.collection.form.statusDraft') },
    {
      value: 'active' as const,
      label: t('admin.collection.form.statusActive'),
    },
    {
      value: 'expired' as const,
      label: t('admin.collection.form.statusExpired'),
    },
    {
      value: 'inactive' as const,
      label: t('admin.collection.form.statusInactive'),
    },
  ];

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
              ? t('admin.collection.form.editTitle')
              : t('admin.collection.form.addTitle')}
          </h2>
        ) : null}
        <FormItem name="name" label={t('admin.collection.form.name')}>
          <Input
            placeholder={t('admin.collection.form.placeholderName')}
            size="large"
          />
        </FormItem>
        <FormItem name="slug" label={t('admin.collection.form.slug')}>
          <Input
            placeholder={t('admin.collection.form.placeholderSlug')}
            size="large"
          />
        </FormItem>
        <FormItem name="images" label={t('admin.collection.form.banner')}>
          {({ field }) => (
            <ImageUploader
              fileList={(field.value as UploadFile[]) || []}
              onChange={(fileList) => field.onChange(fileList.slice(0, 1))}
              maxCount={1}
              uploadLabel={t('admin.product.form.upload')}
              multiple={false}
            />
          )}
        </FormItem>
        <FormItem
          name="productsCount"
          label={t('admin.collection.form.productsCount')}
          getValueFromEvent={(value) => (value as number | null) ?? 0}
        >
          <InputNumber min={0} className="w-full" size="large" />
        </FormItem>
        <FormItem name="startDate" label={t('admin.collection.form.startDate')}>
          <DatePicker className="w-full" size="large" />
        </FormItem>
        <FormItem name="endDate" label={t('admin.collection.form.endDate')}>
          <DatePicker className="w-full" size="large" />
        </FormItem>
        <FormItem name="status" label={t('admin.collection.form.status')}>
          <Select options={statusOptions} />
        </FormItem>
        <FormItem
          name="featured"
          label={t('admin.collection.form.featured')}
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
        <Button type="primary" htmlType="submit" block size="large">
          {isEdit
            ? t('admin.collection.form.submitUpdate')
            : t('admin.collection.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default CollectionForm;
