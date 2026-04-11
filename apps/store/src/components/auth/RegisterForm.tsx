import { Button, Form, Input } from 'antd';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormItem } from '@shared';
import {
  RegisterSchema,
  type RegisterFormValues,
} from '../../pages/AuthPage/schema';
import { zodResolver } from '@hookform/resolvers/zod';

type RegisterFormProps = {
  loading: boolean;
  initialValues: RegisterFormValues;
  onSubmit: (values: RegisterFormValues) => void;
};

const RegisterForm = ({
  loading,
  initialValues,
  onSubmit,
}: RegisterFormProps) => {
  const { t } = useTranslation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onSubmit',
    defaultValues: initialValues,
  });
  const { handleSubmit, reset, clearErrors } = form;

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <FormProvider {...form}>
      <Form
        className="mt-8"
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <FormItem name="username">
          <Input
            size="large"
            placeholder={t('auth.username')}
            autoComplete="off"
            onFocus={() => clearErrors('username')}
          />
        </FormItem>
        <FormItem name="email">
          <Input
            size="large"
            placeholder={t('auth.email')}
            autoComplete="off"
            onFocus={() => clearErrors('email')}
          />
        </FormItem>
        <FormItem name="phoneNumber">
          <Input
            size="large"
            placeholder={t('auth.phoneNumber')}
            autoComplete="off"
            onFocus={() => clearErrors('phoneNumber')}
          />
        </FormItem>
        <FormItem name="password">
          <Input.Password
            size="large"
            placeholder={t('auth.password')}
            autoComplete="new-password"
            onFocus={() => {
              clearErrors('password');
              clearErrors('confirmPassword');
            }}
          />
        </FormItem>
        <FormItem name="confirmPassword">
          <Input.Password
            size="large"
            placeholder={t('auth.confirmPassword')}
            autoComplete="new-password"
            onFocus={() => clearErrors('confirmPassword')}
          />
        </FormItem>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          disabled={loading}
          className="!h-11 w-full rounded-md !bg-[#a66e7f] hover:!bg-[#8d5c6d]"
        >
          {t('auth.register')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default RegisterForm;
