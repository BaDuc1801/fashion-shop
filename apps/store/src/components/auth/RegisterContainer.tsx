import { useState } from 'react';
import OtpSection from './OtpSection';
import RegisterForm from './RegisterForm';
import { useTranslation } from 'react-i18next';
import { message, Button, Spin } from 'antd';
import { useRegisterMutation, useSendOtpMutation } from '@shared';

const RegisterContainer = () => {
  const { t } = useTranslation();

  // --- Form state ---
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  // --- OTP state ---
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const sendOtpMutation = useSendOtpMutation();
  const registerMutation = useRegisterMutation();

  // --- Handlers ---
  const handleSendOtp = () => {
    setError('');
    sendOtpMutation.mutate(
      { email: formValues.email },
      {
        onSuccess: (data) => {
          if (data?.message) {
            message.success(data.message);
            setStep('otp');
          }
        },
        onError: (err: any) => {
          const errorMessage = err?.message || t('auth.sendOtpFailed');
          setError(errorMessage);
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    const otp = otpDigits.join('');
    if (otp !== '0000') {
      setError(t('auth.invalidOtp'));
      return;
    }

    setError('');
    registerMutation.mutate(
      {
        email: formValues.email,
        password: formValues.password,
        fullName: formValues.username,
        phone: formValues.phoneNumber,
        otp,
      },
      {
        onSuccess: (data) => {
          if (data?.token) {
            message.success(t('auth.registerSuccess'));
            setError('');
          } else {
            setError(data?.message || t('auth.registerFailed'));
          }
        },
        onError: (err: any) => {
          const errorMessage = err?.message || t('auth.registerFailed');
          setError(errorMessage);
        },
      },
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {step === 'form' ? (
        <RegisterForm
          username={formValues.username}
          email={formValues.email}
          password={formValues.password}
          confirmPassword={formValues.confirmPassword}
          error={error}
          loading={sendOtpMutation.isPending}
          onUsernameChange={(v) =>
            setFormValues((prev) => ({ ...prev, username: v }))
          }
          onEmailChange={(v) =>
            setFormValues((prev) => ({ ...prev, email: v }))
          }
          onPasswordChange={(v) =>
            setFormValues((prev) => ({ ...prev, password: v }))
          }
          onConfirmPasswordChange={(v) =>
            setFormValues((prev) => ({ ...prev, confirmPassword: v }))
          }
          onSubmit={handleSendOtp}
        />
      ) : (
        <OtpSection
          t={t}
          otpDigits={otpDigits}
          setOtpDigits={setOtpDigits}
          error={error}
          setError={setError}
          onVerified={handleVerifyOtp}
          loading={registerMutation.isPending}
        />
      )}
    </div>
  );
};

export default RegisterContainer;
