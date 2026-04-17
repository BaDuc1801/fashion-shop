import { Button, Form, Input, Switch, UploadFile } from 'antd';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormItem, ImageUploader, type UserMeData } from '@shared';
import {
  createUserFormSchema,
  userFormSchemaDefaultValues,
  type UserFormValues,
} from './schemas/userFormSchema';

interface UserFormProps {
  initialValues?: UserMeData;
  isEdit?: boolean;
  showTitle?: boolean;
  submitting?: boolean;
  onSubmit?: (values: UserFormValues) => void | Promise<void>;
}

const UserForm = ({
  initialValues,
  isEdit,
  showTitle = true,
  submitting = false,
  onSubmit,
}: UserFormProps) => {
  const { t } = useTranslation();
  const userSchema = createUserFormSchema(t);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: 'onSubmit',
    defaultValues: userFormSchemaDefaultValues,
  });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (initialValues) {
      reset({
        avatar: initialValues.avatar
          ? [
              {
                uid: `${initialValues._id}-avatar`,
                name: `${initialValues.name}-avatar`,
                status: 'done',
                url: initialValues.avatar,
              } as UploadFile,
            ]
          : [],
        name: initialValues.name,
        email: initialValues.email,
        phone: initialValues.phone ?? '',
        status: initialValues.status === 'active',
      });
    }
  }, [initialValues, reset]);

  const handleFinish = async (values: UserFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <FormProvider {...form}>
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFinish)}
        className=" space-y-2"
      >
        {showTitle ? (
          <h2 className="text-xl font-semibold">
            {isEdit
              ? t('admin.user.form.editTitle')
              : t('admin.user.form.addTitle')}
          </h2>
        ) : null}
        <FormItem name="avatar" label={t('admin.employee.form.avatar')}>
          {({ field }) => (
            <ImageUploader
              fileList={(field.value as UploadFile[]) || []}
              onChange={(fileList) => field.onChange(fileList.slice(0, 1))}
              maxCount={1}
              uploadLabel={t('admin.category.form.upload')}
            />
          )}
        </FormItem>
        <FormItem name="name" label={t('admin.user.form.name')}>
          <Input
            placeholder={t('admin.user.form.placeholderName')}
            size="large"
          />
        </FormItem>
        <FormItem name="email" label={t('admin.user.form.email')}>
          <Input
            placeholder={t('admin.user.form.placeholderEmail')}
            size="large"
          />
        </FormItem>
        <FormItem name="phone" label={t('admin.user.form.phone')}>
          <Input
            placeholder={t('admin.user.form.placeholderPhone')}
            size="large"
          />
        </FormItem>
        <FormItem
          name="status"
          label={t('admin.user.form.active')}
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
            ? t('admin.user.form.submitUpdate')
            : t('admin.user.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default UserForm;
