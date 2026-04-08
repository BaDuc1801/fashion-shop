import { useState } from 'react';
import OtpSection from './OtpSection';
import RegisterForm from './RegisterForm';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import {
  getApiErrorMessage,
  useRegisterMutation,
  useSendOtpMutation,
} from '@shared';
import {
  defaultRegisterValues,
  type RegisterFormValues,
} from '../../pages/AuthPage/schema';

const RegisterContainer = () => {
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState<RegisterFormValues>(
    defaultRegisterValues,
  );

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const sendOtpMutation = useSendOtpMutation();
  const registerMutation = useRegisterMutation();

  const handleSendOtp = (values: RegisterFormValues) => {
    if (sendOtpMutation.isLoading) return;

    setFormValues(values);

    setError('');
    sendOtpMutation.mutate(
      { email: values.email.trim() },
      {
        onSuccess: (data) => {
          if (data?.message) {
            message.success(data.message);
            setOtpDigits(['', '', '', '', '', '']);
            setStep('otp');
          }
        },
        onError: (err: unknown) => {
          const errorMessage = getApiErrorMessage(err, t('auth.sendOtpFailed'));
          setError(errorMessage);
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    if (registerMutation.isLoading) return;

    const otp = otpDigits.join('');
    if (!/^\d{6}$/.test(otp)) {
      setError(t('auth.invalidOtp'));
      return;
    }

    setError('');
    registerMutation.mutate(
      {
        email: formValues.email.trim(),
        password: formValues.password,
        fullName: formValues.username.trim(),
        phone: formValues.phoneNumber.trim(),
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
        onError: (err: unknown) => {
          const errorMessage = getApiErrorMessage(
            err,
            t('auth.registerFailed'),
          );
          setError(errorMessage);
        },
      },
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {step === 'form' ? (
        <RegisterForm
          initialValues={formValues}
          loading={sendOtpMutation.isLoading}
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
          loading={registerMutation.isLoading}
        />
      )}
    </div>
  );
};

export default RegisterContainer;
