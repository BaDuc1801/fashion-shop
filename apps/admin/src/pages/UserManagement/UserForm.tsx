import { Button, Form, Input, Switch } from 'antd';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormItem } from '../../components/common/FormItem';
import type { User } from './usersMockData';
import {
  createUserFormSchema,
  userFormSchemaDefaultValues,
  type UserFormValues,
} from './schemas/userFormSchema';

interface UserFormProps {
  initialValues?: User;
  isEdit?: boolean;
  showTitle?: boolean;
}

const UserForm = ({
  initialValues,
  isEdit,
  showTitle = true,
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
        name: initialValues.name,
        email: initialValues.email,
        phone: initialValues.phone,
        status: initialValues.status === 'active',
      });
    }
  }, [initialValues, reset]);

  const handleFinish = (values: UserFormValues) => {
    console.log('User payload:', values);
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
              ? t('admin.user.form.editTitle')
              : t('admin.user.form.addTitle')}
          </h2>
        ) : null}
        <FormItem name="name" label={t('admin.user.form.name')}>
          <Input placeholder={t('admin.user.form.placeholderName')} />
        </FormItem>
        <FormItem name="email" label={t('admin.user.form.email')}>
          <Input placeholder={t('admin.user.form.placeholderEmail')} />
        </FormItem>
        <FormItem name="phone" label={t('admin.user.form.phone')}>
          <Input placeholder={t('admin.user.form.placeholderPhone')} />
        </FormItem>
        <FormItem
          name="status"
          label={t('admin.user.form.active')}
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
        <Button type="primary" htmlType="submit" block>
          {isEdit
            ? t('admin.user.form.submitUpdate')
            : t('admin.user.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default UserForm;
