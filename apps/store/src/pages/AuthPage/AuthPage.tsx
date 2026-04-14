import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import {
  getApiErrorMessage,
  userService,
  useAuthStore,
  type LoginRequest,
  type ResetPasswordRequest,
  type SendOtpRequest,
  type VerifyOtpRequest,
} from '@shared';
import heroBanner1 from '../../assets/hero-banner-1.png';
import { OTP_SESSION_KEY } from '../../constants/auth';
import ForgotPasswordEmailStep from '../../components/auth/ForgotPasswordEmailStep';
import ForgotPasswordResetStep from '../../components/auth/ForgotPasswordResetStep';
import LoginForm from '../../components/auth/LoginForm';
import OtpSection from '../../components/auth/OtpSection';
import RegisterContainer from '../../components/auth/RegisterContainer';
import { useOtpCountdown } from '../../components/auth/hooks/useOtpCountdown';
import { useResendOtp } from '../../components/auth/hooks/useResendOtp';
import { isWrongOtpError } from '../../utils/authError';
type AuthMode = 'login' | 'register';
type ForgotStep = 'idle' | 'email' | 'otp' | 'reset';

const AuthPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('idle');
  const [forgotOtpDigits, setForgotOtpDigits] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const { remainingSeconds, canResend, setOtpDeadline, setOtpDeadlineMs } =
    useOtpCountdown(forgotStep === 'otp');

  const loginMutation = useMutation({
    mutationFn: (args: LoginRequest) => userService.login(args),
  });
  const sendOtpMutation = useMutation({
    mutationFn: (args: SendOtpRequest) => userService.sendOtp(args),
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (args: ResetPasswordRequest) => userService.resetPassword(args),
  });
  const verifyOtpMutation = useMutation({
    mutationFn: (args: VerifyOtpRequest) => userService.verifyOtp(args),
  });
  const resendOtpMutation = useResendOtp();

  const headline = useMemo(
    () => (mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')),
    [mode, t],
  );
  const forgotOtp = useMemo(() => forgotOtpDigits.join(''), [forgotOtpDigits]);

  useEffect(() => {
    const otpSession = localStorage.getItem(OTP_SESSION_KEY);
    if (otpSession) {
      setMode('register');
    }
  }, []);

  const handleContinue = async () => {
    if (loginMutation.isPending) return;

    if (!email || !password) {
      setError(t('auth.requiredFields'));
      return;
    }

    setError('');
    try {
      const response = await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });
      useAuthStore.getState().setSessionFromLogin(response);
      try {
        const me = await userService.getCurrentUser();
        useAuthStore.getState().mergeUserFromMe(me);
      } catch {
        /* vẫn đăng nhập được nếu chỉ /users/me lỗi */
      }

      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('auth.loginFailed')));
    }
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setPassword('');
    setForgotStep('idle');
    setForgotOtpDigits(['', '', '', '', '', '']);
    setOtpDeadlineMs(null);
  };

  const handleResetPassword = async () => {
    if (resetPasswordMutation.isPending) return;
    if (!forgotEmail || !newPassword || !confirmNewPassword) {
      setError(t('auth.requiredResetFields'));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    setError('');
    try {
      await resetPasswordMutation.mutateAsync({
        email: forgotEmail.trim(),
        newPassword,
      });
      setForgotStep('idle');
      setPassword('');
      setForgotOtpDigits(['', '', '', '', '', '']);
      setOtpDeadlineMs(null);
      setNewPassword('');
      setConfirmNewPassword('');
      setEmail(forgotEmail.trim());
      setError('');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('auth.resetPasswordFailed')));
    }
  };

  const handleSendOtp = async () => {
    if (sendOtpMutation.isPending) return;
    if (!forgotEmail) {
      setError(t('auth.emailRequired'));
      return;
    }
    setError('');
    try {
      const data = await sendOtpMutation.mutateAsync({
        email: forgotEmail.trim(),
      });
      setForgotStep('otp');
      setOtpDeadline(data.otpExpiresAt, data.serverTime);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('auth.sendOtpFailed')));
    }
  };

  const handleVerifyForgotOtp = async (otpValue?: string) => {
    if (verifyOtpMutation.isPending) return;
    const otpToVerify = otpValue ?? forgotOtp;
    if (!forgotEmail || !otpToVerify) {
      setError(t('auth.requiredResetFields'));
      return;
    }
    setError('');
    try {
      await verifyOtpMutation.mutateAsync({
        email: forgotEmail.trim(),
        otp: otpToVerify.trim(),
      });
      setForgotStep('reset');
      setOtpDeadlineMs(null);
    } catch (err: unknown) {
      const errorMessage = getApiErrorMessage(err, t('auth.verifyOtpFailed'));
      if (isWrongOtpError(errorMessage)) {
        setForgotOtpDigits(['', '', '', '', '', '']);
      }
      setError(errorMessage);
    }
  };

  const handleResendForgotOtp = () => {
    if (!canResend || resendOtpMutation.isPending) return;
    setError('');
    resendOtpMutation.mutate(forgotEmail.trim(), {
      onSuccess: (data) => {
        setForgotOtpDigits(['', '', '', '', '', '']);
        setOtpDeadline(data.otpExpiresAt, data.serverTime);
      },
      onError: (err: unknown) => {
        setError(getApiErrorMessage(err, t('auth.resendOtpFailed')));
      },
    });
  };

  return (
    <section className="min-h-dvh bg-[#85503a] p-6 md:p-10 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-[28px] bg-[#f3f3f7] shadow-2xl">
        <div className="w-full p-8 md:w-1/2 md:p-12">
          <div className="mx-auto max-w-sm">
            <div className="mb-8 flex items-center gap-2 rounded-full bg-white p-1">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${
                  mode === 'login'
                    ? 'bg-[#a66e7f] text-white'
                    : 'text-slate-600'
                }`}
              >
                {t('auth.login')}
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${
                  mode === 'register'
                    ? 'bg-[#a66e7f] text-white'
                    : 'text-slate-600'
                }`}
              >
                {t('auth.register')}
              </button>
            </div>

            <h1 className="text-4xl font-semibold text-slate-900">
              {headline}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{t('auth.subtitle')}</p>

            {mode === 'login' ? (
              forgotStep === 'idle' ? (
                <LoginForm
                  email={email}
                  password={password}
                  loading={loginMutation.isPending}
                  error={error}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  onSubmit={handleContinue}
                  onForgotPassword={() => {
                    setForgotStep('email');
                    setError('');
                    setForgotEmail(email);
                    setForgotOtpDigits(['', '', '', '', '', '']);
                  }}
                />
              ) : forgotStep === 'email' ? (
                <ForgotPasswordEmailStep
                  t={t}
                  email={forgotEmail}
                  error={error}
                  loading={sendOtpMutation.isPending}
                  onEmailChange={setForgotEmail}
                  onSendOtp={handleSendOtp}
                  onBack={() => {
                    setForgotStep('idle');
                    setError('');
                    setForgotOtpDigits(['', '', '', '', '', '']);
                    setOtpDeadlineMs(null);
                  }}
                />
              ) : forgotStep === 'otp' ? (
                <div className="mt-8 space-y-4">
                  <OtpSection
                    t={t}
                    otpDigits={forgotOtpDigits}
                    resendLoading={resendOtpMutation.isPending}
                    remainingSeconds={remainingSeconds}
                    canResend={canResend}
                    setOtpDigits={setForgotOtpDigits}
                    error={error}
                    setError={setError}
                    onVerified={handleVerifyForgotOtp}
                    onResend={handleResendForgotOtp}
                    loading={verifyOtpMutation.isPending}
                  />
                  <Button
                    type="link"
                    className="!px-0"
                    onClick={() => {
                      setForgotStep('email');
                      setError('');
                      setForgotOtpDigits(['', '', '', '', '', '']);
                      setOtpDeadlineMs(null);
                    }}
                  >
                    {t('auth.backToLogin')}
                  </Button>
                </div>
              ) : (
                <ForgotPasswordResetStep
                  t={t}
                  email={forgotEmail}
                  newPassword={newPassword}
                  confirmNewPassword={confirmNewPassword}
                  error={error}
                  loading={resetPasswordMutation.isPending}
                  onNewPasswordChange={setNewPassword}
                  onConfirmNewPasswordChange={setConfirmNewPassword}
                  onSubmit={handleResetPassword}
                />
              )
            ) : (
              <RegisterContainer
                onRegisterSuccess={(registeredEmail) => {
                  setMode('login');
                  setEmail(registeredEmail);
                  setPassword('');
                  setError('');
                }}
              />
            )}

            <div className="my-8 h-px bg-slate-200" />
            <p className="mb-4 text-center text-sm text-slate-500">
              {t('auth.continueWith')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-[#db4437]"
              >
                <FaGoogle />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-[#1877f2]"
              >
                <FaFacebookF />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden w-1/2 p-3 md:block">
          <div className="relative h-full overflow-hidden rounded-3xl">
            <img
              src={heroBanner1}
              alt="Auth visual"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <p className="absolute bottom-6 left-6 text-xl font-medium text-white">
              {t('auth.bannerText')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
