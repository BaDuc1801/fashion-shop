import { Button, DatePicker, Form, Input, InputNumber, Switch } from 'antd';
import type { UploadFile } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageUploader } from '@shared';
import type { Voucher } from './vouchersMockData';

type VoucherFormValues = {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  expiresAt: Voucher['expiresAt'];
  status: boolean;
  images: UploadFile[];
};

const VoucherImageField = ({
  value,
  onChange,
  uploadLabel,
}: {
  value?: UploadFile[];
  onChange?: (v: UploadFile[]) => void;
  uploadLabel: string;
}) => (
  <ImageUploader
    fileList={value || []}
    onChange={(fileList) => onChange?.(fileList.slice(0, 1))}
    maxCount={1}
    uploadLabel={uploadLabel}
    multiple={false}
  />
);

interface VoucherFormProps {
  initialValues?: Voucher;
  isEdit?: boolean;
  showTitle?: boolean;
}

const VoucherForm = ({
  initialValues,
  isEdit,
  showTitle = true,
}: VoucherFormProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<VoucherFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        code: initialValues.code,
        discountPercent: initialValues.discountPercent,
        maxDiscount: initialValues.maxDiscount,
        minOrderValue: initialValues.minOrderValue,
        expiresAt: initialValues.expiresAt,
        status: initialValues.status === 'active',
        images: initialValues.image
          ? [
              {
                uid: initialValues.id,
                name: initialValues.code,
                status: 'done',
                url: initialValues.image,
              },
            ]
          : [],
      });
    } else {
      form.setFieldsValue({ images: [] });
    }
  }, [form, initialValues]);

  const handleFinish = (values: VoucherFormValues) => {
    console.log('Voucher payload:', values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="max-w-2xl space-y-2"
      initialValues={{ images: [] as UploadFile[] }}
    >
      {showTitle ? (
        <h2 className="text-xl font-semibold">
          {isEdit
            ? t('admin.voucher.form.editTitle')
            : t('admin.voucher.form.addTitle')}
        </h2>
      ) : null}
      <Form.Item name="images" label={t('admin.voucher.form.image')}>
        <VoucherImageField uploadLabel={t('admin.product.form.upload')} />
      </Form.Item>
      <Form.Item
        name="code"
        label={t('admin.voucher.form.code')}
        rules={[
          {
            required: true,
            message: t('admin.validation.requiredVoucherCode'),
          },
        ]}
      >
        <Input
          placeholder={t('admin.voucher.form.placeholderCode')}
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="discountPercent"
        label={t('admin.voucher.form.discountPercent')}
        rules={[
          { required: true, message: t('admin.validation.requiredDiscount') },
        ]}
      >
        <InputNumber min={1} max={100} className="w-full" size="large" />
      </Form.Item>
      <Form.Item
        name="maxDiscount"
        label={t('admin.voucher.form.maxDiscount')}
        rules={[
          {
            required: true,
            message: t('admin.validation.requiredMaxDiscount'),
          },
        ]}
      >
        <InputNumber min={0} className="w-full" size="large" />
      </Form.Item>
      <Form.Item
        name="minOrderValue"
        label={t('admin.voucher.form.minOrderValue')}
        rules={[
          { required: true, message: t('admin.validation.requiredMinOrder') },
        ]}
      >
        <InputNumber min={0} className="w-full" size="large" />
      </Form.Item>
      <Form.Item
        name="expiresAt"
        label={t('admin.voucher.form.expireDate')}
        rules={[
          { required: true, message: t('admin.validation.selectExpireDate') },
        ]}
      >
        <DatePicker className="w-full" size="large" />
      </Form.Item>
      <Form.Item
        name="status"
        label={t('admin.voucher.form.active')}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large">
        {isEdit
          ? t('admin.voucher.form.submitUpdate')
          : t('admin.voucher.form.submitCreate')}
      </Button>
    </Form>
  );
};

export default VoucherForm;
