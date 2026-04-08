import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import type { RegisterFormValues } from '../../pages/AuthPage/schema';

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

  return (
    <Form
      className="mt-8"
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Username is required' },
          { min: 3, message: 'Username must be at least 3 characters' },
          { max: 20, message: 'Username must be at most 20 characters' },
        ]}
      >
        <Input size="large" placeholder={t('auth.username')} autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email format' },
        ]}
      >
        <Input size="large" placeholder={t('auth.email')} autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        rules={[
          { required: true, message: 'Phone number is required' },
          {
            pattern: /^\d{9,15}$/,
            message: 'Phone number must be 9-15 digits',
          },
        ]}
      >
        <Input size="large" placeholder={t('auth.phoneNumber')} autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 6, message: 'Password must be at least 6 characters' },
        ]}
      >
        <Input.Password
          size="large"
          placeholder={t('auth.password')}
          autoComplete="new-password"
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Confirm password is required' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords must match'));
            },
          }),
        ]}
      >
        <Input.Password
          size="large"
          placeholder={t('auth.confirmPassword')}
          autoComplete="new-password"
        />
      </Form.Item>
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
  );
};

export default RegisterForm;
