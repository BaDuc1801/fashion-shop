import { Button, Input } from 'antd';
import type { TFunction } from 'i18next';

type ForgotPasswordEmailStepProps = {
  t: TFunction;
  email: string;
  error: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSendOtp: () => void;
  onBack: () => void;
};

const ForgotPasswordEmailStep = ({
  t,
  email,
  error,
  loading,
  onEmailChange,
  onSendOtp,
  onBack,
}: ForgotPasswordEmailStepProps) => (
  <div className="mt-8 space-y-4">
    <Input
      size="large"
      placeholder={t('auth.email')}
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
    />
    {error ? <p className="text-sm text-red-500">{error}</p> : null}
    <Button
      size="large"
      className="w-full !bg-[#a66e7f] hover:!bg-[#8d5c6d]"
      type="primary"
      loading={loading}
      onClick={onSendOtp}
    >
      {t('auth.sendOtp')}
    </Button>
    <Button type="link" className="!px-0" onClick={onBack}>
      {t('auth.backToLogin')}
    </Button>
  </div>
);

export default ForgotPasswordEmailStep;
