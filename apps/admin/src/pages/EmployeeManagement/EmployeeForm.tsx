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
import {
  addNewEmployeeSchemaDefaultValues,
  createAddNewEmployeeSchema,
  type AddNewEmployeeFormValues,
} from './schemas/addNewEmployeeSchema';
import { FormItem, ImageUploader } from '@shared';

interface Props {
  initialValues?: AddNewEmployeeFormValues;
  isEdit?: boolean;
  showTitle?: boolean;
  submitting?: boolean;
  onSubmit?: (values: AddNewEmployeeFormValues) => void | Promise<void>;
}

const EmployeeForm = ({
  initialValues,
  isEdit,
  showTitle = true,
  submitting = false,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const employeeSchema = createAddNewEmployeeSchema(t);
  const form = useForm<AddNewEmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: 'onSubmit',
    defaultValues: addNewEmployeeSchemaDefaultValues,
  });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onFormSubmit = async (values: AddNewEmployeeFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <FormProvider {...form}>
      <Form
        layout="vertical"
        onFinish={handleSubmit(onFormSubmit)}
        className="h-fit space-y-4"
      >
        {showTitle ? (
          <h2 className="text-center text-xl font-semibold">
            {isEdit
              ? t('admin.employee.form.editTitle')
              : t('admin.employee.form.addTitle')}
          </h2>
        ) : null}
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col">
            <FormItem name="avatar" label={t('admin.employee.form.avatar')}>
              {({ field }) => (
                <ImageUploader
                  squareFullWidth
                  fileList={((field.value as UploadFile[] | undefined) ?? []).slice(
                    0,
                    1,
                  )}
                  onChange={(fileList) => field.onChange(fileList.slice(0, 1))}
                  maxCount={1}
                  multiple={false}
                  uploadLabel={t('admin.product.form.upload')}
                />
              )}
            </FormItem>
            <FormItem
              name="status"
              label={t('admin.employee.form.active')}
              valuePropName="checked"
            >
              <Switch />
            </FormItem>
          </div>
          <div className="flex flex-col">
            <FormItem name="name" label={t('admin.employee.form.name')}>
              <Input
                placeholder={t('admin.employee.form.placeholderName')}
                size="large"
              />
            </FormItem>
            <FormItem name="phone" label={t('admin.employee.form.phone')}>
              <Input
                placeholder={t('admin.employee.form.placeholderPhone')}
                size="large"
              />
            </FormItem>
            <FormItem name="joinDate" label={t('admin.employee.form.joinDate')}>
              <DatePicker className="w-full" size="large" />
            </FormItem>
          </div>
          <div className="flex flex-col">
            <FormItem name="email" label={t('admin.employee.form.email')}>
              <Input
                placeholder={t('admin.employee.form.placeholderEmail')}
                size="large"
              />
            </FormItem>
            <FormItem
              name="salary"
              label={t('admin.employee.form.salary')}
              getValueFromEvent={(value) => (value as number | null) ?? 0}
            >
              <InputNumber className="w-full" size="large" />
            </FormItem>
            <FormItem name="role" label={t('admin.user.col.role')}>
              <Select
                size="large"
                options={[
                  { label: t('admin.employee.form.admin'), value: 'admin' },
                  { label: t('admin.employee.form.staff'), value: 'staff' },
                ]}
              />
            </FormItem>
          </div>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          className="mt-4"
          loading={submitting}
        >
          {isEdit
            ? t('admin.employee.form.submitUpdate')
            : t('admin.employee.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default EmployeeForm;
