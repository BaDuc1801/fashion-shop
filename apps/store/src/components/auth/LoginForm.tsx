import { Button, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  email: string;
  password: string;
  loading: boolean;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
};

const LoginForm = ({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="mt-8 space-y-4"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSubmit();
        }
      }}
    >
      <Input
        size="large"
        placeholder={t('auth.email')}
        value={email}
        autoComplete="off"
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <Input.Password
        size="large"
        placeholder={t('auth.password')}
        value={password}
        autoComplete="new-password"
        onChange={(e) => onPasswordChange(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm text-slate-500 underline"
          onClick={onForgotPassword}
        >
          {t('auth.forgotPassword')}
        </button>
        <button
          type="button"
          className="text-sm text-slate-500 underline"
          onClick={() => navigate('/')}
        >
          {t('continueAsGuest')}
        </button>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button
        type="primary"
        size="large"
        loading={loading}
        disabled={loading}
        className="!h-11 w-full rounded-md !bg-[#a66e7f] hover:!bg-[#8d5c6d]"
        onClick={onSubmit}
      >
        {t('auth.login')}
      </Button>
    </div>
  );
};

export default LoginForm;
