import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import OtpSection from './OtpSection';
import RegisterForm from './RegisterForm';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import {
  getApiErrorMessage,
  userService,
  type RegisterRequest,
  type SendOtpRequest,
} from '@shared';
import {
  defaultRegisterValues,
  type RegisterFormValues,
} from '../../pages/AuthPage/schema';

type RegisterContainerProps = {
  onRegisterSuccess?: (email: string) => void;
};

const RegisterContainer = ({ onRegisterSuccess }: RegisterContainerProps) => {
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState<RegisterFormValues>(
    defaultRegisterValues,
  );

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const sendOtpMutation = useMutation({
    mutationFn: (args: SendOtpRequest) => userService.sendOtp(args),
  });

  const registerMutation = useMutation({
    mutationFn: (args: RegisterRequest) => userService.register(args),
  });

  const handleSendOtp = (values: RegisterFormValues) => {
    if (sendOtpMutation.isPending) return;

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

  const handleVerifyOtp = (otpFromInput: string) => {
    if (registerMutation.isPending) return;

    if (!/^\d{6}$/.test(otpFromInput)) {
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
        otp: otpFromInput,
      },
      {
        onSuccess: (data) => {
          const token = data?.data?.token ?? data?.token;
          if (token) {
            message.success(t('auth.registerSuccess'));
            setError('');
            onRegisterSuccess?.(formValues.email.trim());
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
          loading={sendOtpMutation.isPending}
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
