import { useMutation } from '@tanstack/react-query';
import { Button, Card, Form, Input, Modal, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  getApiErrorMessage,
  isAdminUser,
  userService,
  useAuthStore,
  type LoginRequest,
} from '@shared';
import OtpCodeInput from '../../components/auth/OtpCodeInput';

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
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset'>(
    'email',
  );
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpDigits, setForgotOtpDigits] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [otpDeadlineMs, setOtpDeadlineMs] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const loginMutation = useMutation({
    mutationFn: (args: LoginRequest) => userService.login(args),
  });
  const sendForgotOtpMutation = useMutation({
    mutationFn: (email: string) => userService.sendOtp({ email }),
  });
  const verifyForgotOtpMutation = useMutation({
    mutationFn: (args: { email: string; otp: string }) =>
      userService.verifyOtp(args),
  });
  const resendForgotOtpMutation = useMutation({
    mutationFn: (email: string) => userService.resendOtp({ email }),
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (args: { email: string; newPassword: string }) =>
      userService.resetPassword(args),
  });

  const canResendOtp = remainingSeconds <= 0;
  const forgotOtpValue = useMemo(
    () => forgotOtpDigits.join(''),
    [forgotOtpDigits],
  );

  useEffect(() => {
    if (!hasHydrated) return;
    if (token && user && !isAdminUser(user)) {
      useAuthStore.getState().clearSession();
      setError(t('admin.auth.adminOnly'));
    }
  }, [hasHydrated, token, user, t]);

  useEffect(() => {
    if (!otpDeadlineMs || forgotStep !== 'otp') {
      setRemainingSeconds(0);
      return;
    }
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((otpDeadlineMs - Date.now()) / 1000));
      setRemainingSeconds(seconds);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [otpDeadlineMs, forgotStep]);

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

  const resetForgotState = () => {
    setForgotStep('email');
    setForgotEmail('');
    setForgotOtpDigits(['', '', '', '', '', '']);
    setForgotPassword('');
    setForgotConfirmPassword('');
    setForgotError('');
    setOtpDeadlineMs(null);
    setRemainingSeconds(0);
  };

  const isWrongOtpError = (rawError: unknown) => {
    const msg = getApiErrorMessage(rawError, '').toLowerCase();
    return msg.includes('wrong otp') || msg.includes('invalid otp');
  };

  const setDeadlineFromResponse = (
    otpExpiresAt?: string,
    serverTime?: string,
  ) => {
    const expires = otpExpiresAt ? Date.parse(otpExpiresAt) : NaN;
    const server = serverTime ? Date.parse(serverTime) : NaN;
    const now = Number.isFinite(server) ? server : Date.now();
    if (Number.isFinite(expires) && expires > now) {
      setOtpDeadlineMs(expires);
      return;
    }
    setOtpDeadlineMs(Date.now() + 5 * 60 * 1000);
  };

  const handleSendForgotOtp = async () => {
    const email = forgotEmail.trim();
    if (!email) {
      setForgotError(t('admin.auth.requiredEmail'));
      return;
    }
    setForgotError('');
    try {
      const response = await sendForgotOtpMutation.mutateAsync(email);
      setDeadlineFromResponse(response.otpExpiresAt, response.serverTime);
      setForgotOtpDigits(['', '', '', '', '', '']);
      setForgotStep('otp');
    } catch (err: unknown) {
      setForgotError(getApiErrorMessage(err, t('admin.auth.sendOtpFailed')));
    }
  };

  const handleVerifyForgotOtp = async () => {
    if (forgotOtpValue.length !== 6) {
      setForgotError(t('admin.auth.invalidOtp'));
      return;
    }
    setForgotError('');
    try {
      await verifyForgotOtpMutation.mutateAsync({
        email: forgotEmail.trim(),
        otp: forgotOtpValue,
      });
      setForgotStep('reset');
    } catch (err: unknown) {
      if (isWrongOtpError(err)) {
        setForgotOtpDigits(['', '', '', '', '', '']);
      }
      setForgotError(getApiErrorMessage(err, t('admin.auth.verifyOtpFailed')));
    }
  };

  const handleResendForgotOtp = async () => {
    if (!canResendOtp) return;
    setForgotError('');
    try {
      const response = await resendForgotOtpMutation.mutateAsync(
        forgotEmail.trim(),
      );
      setDeadlineFromResponse(response.otpExpiresAt, response.serverTime);
      setForgotOtpDigits(['', '', '', '', '', '']);
    } catch (err: unknown) {
      setForgotError(getApiErrorMessage(err, t('admin.auth.resendOtpFailed')));
    }
  };

  const handleResetForgotPassword = async () => {
    if (!forgotPassword || !forgotConfirmPassword) {
      setForgotError(t('admin.auth.requiredResetPasswordFields'));
      return;
    }
    if (forgotPassword.length < 6) {
      setForgotError(t('admin.auth.passwordMin'));
      return;
    }
    if (forgotPassword !== forgotConfirmPassword) {
      setForgotError(t('admin.auth.passwordNotMatch'));
      return;
    }
    setForgotError('');
    try {
      await resetPasswordMutation.mutateAsync({
        email: forgotEmail.trim(),
        newPassword: forgotPassword,
      });
      setForgotOpen(false);
      resetForgotState();
    } catch (err: unknown) {
      setForgotError(
        getApiErrorMessage(err, t('admin.auth.resetPasswordFailed')),
      );
    }
  };

  const handleSubmit = async (values: LoginFormValues) => {
    setError('');
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
      });
      useAuthStore.getState().setSessionFromLogin(response);
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
          <div className="text-right">
            <Button
              type="link"
              className="!px-0"
              onClick={() => {
                setForgotOpen(true);
                resetForgotState();
              }}
            >
              {t('admin.auth.forgotPassword')}
            </Button>
          </div>
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
      <Modal
        title={t('admin.auth.forgotPassword')}
        open={forgotOpen}
        onCancel={() => {
          setForgotOpen(false);
          resetForgotState();
        }}
        footer={null}
        destroyOnHidden
      >
        <div className="space-y-4 pt-2">
          {forgotStep === 'email' ? (
            <>
              <Input
                size="large"
                type="email"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                placeholder={t('admin.auth.email')}
              />
              <Button
                type="primary"
                block
                size="large"
                loading={sendForgotOtpMutation.isPending}
                onClick={() => void handleSendForgotOtp()}
              >
                {t('admin.auth.sendOtp')}
              </Button>
            </>
          ) : null}
          {forgotStep === 'otp' ? (
            <>
              <OtpCodeInput
                value={forgotOtpDigits}
                onChange={setForgotOtpDigits}
                disabled={verifyForgotOtpMutation.isPending}
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {t('admin.auth.otpExpiresIn', {
                    time: `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`,
                  })}
                </span>
                <Button
                  type="link"
                  className="!px-0"
                  onClick={() => void handleResendForgotOtp()}
                  loading={resendForgotOtpMutation.isPending}
                  disabled={!canResendOtp || resendForgotOtpMutation.isPending}
                >
                  {t('admin.auth.resendOtp')}
                </Button>
              </div>
              <Button
                type="primary"
                block
                size="large"
                loading={verifyForgotOtpMutation.isPending}
                onClick={() => void handleVerifyForgotOtp()}
              >
                {t('admin.auth.verifyOtp')}
              </Button>
            </>
          ) : null}
          {forgotStep === 'reset' ? (
            <>
              <Input size="large" value={forgotEmail} disabled />
              <Input.Password
                size="large"
                value={forgotPassword}
                onChange={(event) => setForgotPassword(event.target.value)}
                placeholder={t('admin.auth.newPassword')}
              />
              <Input.Password
                size="large"
                value={forgotConfirmPassword}
                onChange={(event) =>
                  setForgotConfirmPassword(event.target.value)
                }
                placeholder={t('admin.auth.confirmNewPassword')}
              />
              <Button
                type="primary"
                block
                size="large"
                loading={resetPasswordMutation.isPending}
                onClick={() => void handleResetForgotPassword()}
              >
                {t('admin.auth.resetPassword')}
              </Button>
            </>
          ) : null}
          {forgotError ? (
            <p className="text-sm text-red-600">{forgotError}</p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
