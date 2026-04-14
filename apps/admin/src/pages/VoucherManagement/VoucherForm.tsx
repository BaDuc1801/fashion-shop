import { Button, DatePicker, Form, Input, InputNumber, Switch } from 'antd';
import type { UploadFile } from 'antd';
import { useTranslation } from 'react-i18next';
import { CreateVoucherRequest, FormItem, ImageUploader } from '@shared';
import { FormProvider, useForm } from 'react-hook-form';
import {
  createVoucherFormSchema,
  voucherFormSchemaDefaultValues,
  type VoucherFormValues,
} from './schema/createVoucherFormSchema';
import { useVoucherDetail } from './hooks/useVoucherDetail';
import { zodResolver } from '@hookform/resolvers/zod';
interface VoucherFormProps {
  initialValues?: CreateVoucherRequest;
  isEdit?: boolean;
  showTitle?: boolean;
  onSubmit?: (values: VoucherFormValues) => void | Promise<void>;
  submitting?: boolean;
}

const VoucherForm = ({
  initialValues,
  isEdit,
  showTitle = true,
  onSubmit,
  submitting,
}: VoucherFormProps) => {
  const { t } = useTranslation();
  const voucherSchema = createVoucherFormSchema(t);
  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    mode: 'onSubmit',
    defaultValues: voucherFormSchemaDefaultValues,
  });

  const { handleSubmit, reset } = form;
  useVoucherDetail({ initialValues, reset });
  const handleFinish = async (values: VoucherFormValues) => {
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
              ? t('admin.voucher.form.editTitle')
              : t('admin.voucher.form.addTitle')}
          </h2>
        ) : null}
        <FormItem name="image" label={t('admin.voucher.form.image')}>
          {({ field }) => (
            <ImageUploader
              fileList={(field.value as UploadFile[]) || []}
              onChange={(fileList) => field.onChange(fileList.slice(0, 1))}
              maxCount={1}
              uploadLabel={t('admin.product.form.upload')}
            />
          )}
        </FormItem>
        <FormItem name="code" label={t('admin.voucher.form.code')}>
          <Input
            placeholder={t('admin.voucher.form.placeholderCode')}
            size="large"
          />
        </FormItem>
        <FormItem
          name="discountPercent"
          label={t('admin.voucher.form.discountPercent')}
        >
          <InputNumber min={1} max={100} className="w-full" size="large" />
        </FormItem>
        <FormItem
          name="maxDiscount"
          label={t('admin.voucher.form.maxDiscount')}
        >
          <InputNumber min={0} className="w-full" size="large" />
        </FormItem>
        <FormItem
          name="minOrderValue"
          label={t('admin.voucher.form.minOrderValue')}
        >
          <InputNumber min={0} className="w-full" size="large" />
        </FormItem>
        <FormItem name="expiresAt" label={t('admin.voucher.form.expireDate')}>
          <DatePicker className="w-full" size="large" />
        </FormItem>
        <FormItem
          name="status"
          label={t('admin.voucher.form.active')}
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
            ? t('admin.voucher.form.submitUpdate')
            : t('admin.voucher.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default VoucherForm;
