import { Button, DatePicker, Form, Input, InputNumber, Switch } from 'antd';
import type { UploadFile } from 'antd';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormItem } from '../../components/common/FormItem';
import ImageUploader from '../../components/common/ImageUploader';
import type { Employee } from './employeesMockData';
import {
  addNewEmployeeSchemaDefaultValues,
  createAddNewEmployeeSchema,
  AddNewEmployeeFormValues,
} from './schemas/addNewEmployeeSchema';

interface Props {
  initialValues?: AddNewEmployeeFormValues;
  isEdit?: boolean;
  showTitle?: boolean;
  onSubmit?: (values: Employee) => void;
}

const EmployeeForm = ({
  initialValues,
  isEdit,
  showTitle = true,
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

  const onFormSubmit = (values: AddNewEmployeeFormValues) => {
    const payload: Employee = {
      id: values.id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      joinDate: values.joinDate,
      salary: values.salary,
      avatar: { url: values.avatar || '', name: 'avatar.png' },
      status: values.status ? 'active' : 'inactive',
      role: values.role,
    };

    onSubmit?.(payload);
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
          <div className="flex flex-col gap-2">
            <FormItem name="avatar" label={t('admin.employee.form.avatar')}>
              {({ field }) => (
                <ImageUploader
                  squareFullWidth
                  fileList={
                    field.value
                      ? [
                          {
                            uid: 'employee-avatar',
                            name: 'avatar',
                            status: 'done',
                            url: field.value,
                          } satisfies UploadFile,
                        ]
                      : []
                  }
                  onChange={(fileList) => {
                    const first = fileList[0];
                    const nextUrl =
                      first?.url ||
                      (first?.originFileObj
                        ? URL.createObjectURL(first.originFileObj)
                        : '');
                    field.onChange(nextUrl);
                  }}
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
          <div className="flex flex-col gap-2">
            <FormItem name="name" label={t('admin.employee.form.name')}>
              <Input placeholder={t('admin.employee.form.placeholderName')} />
            </FormItem>
            <FormItem name="phone" label={t('admin.employee.form.phone')}>
              <Input placeholder={t('admin.employee.form.placeholderPhone')} />
            </FormItem>
            <FormItem name="joinDate" label={t('admin.employee.form.joinDate')}>
              <DatePicker className="w-full" />
            </FormItem>
          </div>
          <div className="flex flex-col gap-2">
            <FormItem name="email" label={t('admin.employee.form.email')}>
              <Input placeholder={t('admin.employee.form.placeholderEmail')} />
            </FormItem>
            <FormItem
              name="salary"
              label={t('admin.employee.form.salary')}
              getValueFromEvent={(value) => (value as number | null) ?? 0}
            >
              <InputNumber className="w-full" />
            </FormItem>
          </div>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          className="mt-4"
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
