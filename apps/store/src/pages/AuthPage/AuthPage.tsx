import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  getApiErrorMessage,
  userService,
  useAuthStore,
  type LoginRequest,
} from '@shared';
import heroBanner1 from '../../assets/hero-banner-1.png';
import LoginForm from '../../components/auth/LoginForm';
import RegisterContainer from '../../components/auth/RegisterContainer';
type AuthMode = 'login' | 'register';

const AuthPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: (args: LoginRequest) => userService.login(args),
  });

  const headline = useMemo(
    () => (mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')),
    [mode, t],
  );

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
      const loginData = response?.data;
      if (!loginData?.token) {
        setError(response?.message || t('auth.loginFailed'));
        return;
      }
      useAuthStore.getState().setSessionFromLogin(loginData);
      const me = await userService.getCurrentUser();
      if (me?.data) {
        useAuthStore.getState().mergeUserFromMe(me.data);
      }

      navigate('/');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('auth.loginFailed')));
    }
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setPassword('');
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
              <LoginForm
                email={email}
                password={password}
                loading={loginMutation.isPending}
                error={error}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleContinue}
              />
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
