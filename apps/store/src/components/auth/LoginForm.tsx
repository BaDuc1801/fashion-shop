import { Button, Input } from 'antd';
import { useTranslation } from 'react-i18next';

type LoginFormProps = {
  email: string;
  password: string;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

const LoginForm = ({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 space-y-4">
      <Input
        size="large"
        placeholder={t('auth.email')}
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <Input.Password
        size="large"
        placeholder={t('auth.password')}
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button
        type="primary"
        size="large"
        className="!h-11 w-full rounded-md !bg-[#a66e7f] hover:!bg-[#8d5c6d]"
        onClick={onSubmit}
      >
        {t('auth.login')}
      </Button>
    </div>
  );
};

export default LoginForm;
