import { useMutation } from '@tanstack/react-query';
import { Button, Card, Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  getApiErrorMessage,
  isAdminUser,
  userService,
  useAuthStore,
  type LoginRequest,
} from '@shared';

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: (args: LoginRequest) => userService.login(args),
  });

  useEffect(() => {
    if (!hasHydrated) return;
    if (token && user && !isAdminUser(user)) {
      useAuthStore.getState().clearSession();
      setError(t('admin.auth.adminOnly'));
    }
  }, [hasHydrated, token, user, t]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  if (token && isAdminUser(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (values: LoginFormValues) => {
    setError('');
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
      });
      const loginData = response?.data;
      const sessionToken = loginData?.accessToken;
      if (!loginData || !sessionToken) {
        setError(response?.message || t('admin.auth.failed'));
        return;
      }
      useAuthStore.getState().setSessionFromLogin({
        ...loginData,
        accessToken: sessionToken,
      });
      try {
        const me = await userService.getCurrentUser();
        if (me?.data) {
          useAuthStore.getState().mergeUserFromMe(me.data);
        }
      } catch {
        /* bỏ qua */
      }

      if (!isAdminUser(useAuthStore.getState().user)) {
        useAuthStore.getState().clearSession();
        setError(t('admin.auth.adminOnly'));
        return;
      }

      navigate('/dashboard');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('admin.auth.failed')));
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-100 p-4">
      <Card
        title={t('admin.auth.title')}
        className="w-full max-w-md text-center"
      >
        <Form layout="vertical" onFinish={handleSubmit} className="space-y-4">
          <Form.Item
            name="email"
            label={t('admin.auth.email')}
            rules={[{ required: true, message: t('admin.auth.email') }]}
          >
            <Input size="large" type="email" autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('admin.auth.password')}
            rules={[{ required: true, message: t('admin.auth.password') }]}
          >
            <Input.Password size="large" autoComplete="current-password" />
          </Form.Item>
          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loginMutation.isPending}
            className="mt-6"
          >
            {t('admin.auth.submit')}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
