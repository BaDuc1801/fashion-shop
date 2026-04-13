import { Button, Input } from 'antd';
import type { TFunction } from 'i18next';

type ForgotPasswordResetStepProps = {
  t: TFunction;
  email: string;
  newPassword: string;
  confirmNewPassword: string;
  error: string;
  loading: boolean;
  onNewPasswordChange: (value: string) => void;
  onConfirmNewPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

const ForgotPasswordResetStep = ({
  t,
  email,
  newPassword,
  confirmNewPassword,
  error,
  loading,
  onNewPasswordChange,
  onConfirmNewPasswordChange,
  onSubmit,
}: ForgotPasswordResetStepProps) => (
  <div className="mt-8 space-y-4">
    <Input size="large" value={email} disabled />
    <Input.Password
      size="large"
      placeholder={t('auth.newPassword')}
      value={newPassword}
      onChange={(e) => onNewPasswordChange(e.target.value)}
    />
    <Input.Password
      size="large"
      placeholder={t('auth.confirmPassword')}
      value={confirmNewPassword}
      onChange={(e) => onConfirmNewPasswordChange(e.target.value)}
    />
    {error ? <p className="text-sm text-red-500">{error}</p> : null}
    <Button
      type="primary"
      size="large"
      className="!h-11 w-full rounded-md !bg-[#a66e7f] hover:!bg-[#8d5c6d]"
      loading={loading}
      onClick={onSubmit}
    >
      {t('auth.resetPassword')}
    </Button>
  </div>
);

export default ForgotPasswordResetStep;
