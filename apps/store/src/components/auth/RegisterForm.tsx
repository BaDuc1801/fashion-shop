import { Button, Input } from 'antd';
import { useTranslation } from 'react-i18next';

type RegisterFormProps = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  error?: string;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

const RegisterForm = ({
  username,
  email,
  password,
  confirmPassword,
  error,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: RegisterFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 space-y-4">
      <Input
        size="large"
        placeholder={t('auth.username')}
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
      />
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
      <Input.Password
        size="large"
        placeholder={t('auth.confirmPassword')}
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button
        type="primary"
        size="large"
        className="!h-11 w-full rounded-md !bg-[#a66e7f] hover:!bg-[#8d5c6d]"
        onClick={onSubmit}
      >
        {t('auth.register')}
      </Button>
    </div>
  );
};

export default RegisterForm;
