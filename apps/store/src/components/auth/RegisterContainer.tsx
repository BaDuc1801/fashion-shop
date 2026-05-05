import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import OtpSection from './OtpSection';
import RegisterForm from './RegisterForm';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import {
  getApiErrorMessage,
  userService,
  type RegisterRequest,
  type VerifyOtpRequest,
} from '@shared';
import { useOtpCountdown } from './hooks/useOtpCountdown';
import { useResendOtp } from './hooks/useResendOtp';
import {
  defaultRegisterValues,
  type RegisterFormValues,
} from '../../pages/AuthPage/schema';
import { OTP_SESSION_KEY } from '../../constants/auth';
import { isWrongOtpError } from '../../utils/authError';

type RegisterContainerProps = {
  onRegisterSuccess?: (email: string) => void;
};

type OtpSession = {
  email: string;
  deadlineMs: number;
};

const RegisterContainer = ({ onRegisterSuccess }: RegisterContainerProps) => {
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState<RegisterFormValues>(
    defaultRegisterValues,
  );

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const {
    otpDeadlineMs,
    remainingSeconds,
    canResend,
    setOtpDeadline,
    setOtpDeadlineMs,
  } = useOtpCountdown(step === 'otp');

  const registerMutation = useMutation({
    mutationFn: (args: RegisterRequest) => userService.register(args),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (args: VerifyOtpRequest) => userService.verifyOtp(args),
  });

  const resendOtpMutation = useResendOtp();

  const deleteUserMutation = useMutation({
    mutationFn: () => userService.deleteUserByEmail(formValues.email.trim()),
    onSuccess: () => {
      localStorage.removeItem(OTP_SESSION_KEY);
      setStep('form');
      setOtpDigits(['', '', '', '', '', '']);
      setError('');
    },
  });

  useEffect(() => {
    const rawSession = localStorage.getItem(OTP_SESSION_KEY);
    if (!rawSession) return;
    try {
      const session = JSON.parse(rawSession) as OtpSession;
      if (!session.email || !session.deadlineMs) {
        localStorage.removeItem(OTP_SESSION_KEY);
        return;
      }
      if (session.deadlineMs <= Date.now()) {
        localStorage.removeItem(OTP_SESSION_KEY);
        return;
      }
      setFormValues((prev) => ({ ...prev, email: session.email }));
      setOtpDeadlineMs(session.deadlineMs);
      setStep('otp');
    } catch {
      localStorage.removeItem(OTP_SESSION_KEY);
    }
  }, [setOtpDeadlineMs]);

  useEffect(() => {
    if (step !== 'otp' || !otpDeadlineMs || !formValues.email) return;
    localStorage.setItem(
      OTP_SESSION_KEY,
      JSON.stringify({
        email: formValues.email.trim(),
        deadlineMs: otpDeadlineMs,
      } satisfies OtpSession),
    );
  }, [step, otpDeadlineMs, formValues.email]);

  useEffect(() => {
    if (remainingSeconds > 0) return;
    if (step !== 'otp') return;
    localStorage.removeItem(OTP_SESSION_KEY);
  }, [remainingSeconds, step]);

  const handleRegister = (values: RegisterFormValues) => {
    if (registerMutation.isPending) return;
    setFormValues(values);
    setError('');
    registerMutation.mutate(
      {
        email: values.email.trim(),
        password: values.password,
        name: values.name.trim(),
        phone: values.phoneNumber.trim(),
      },
      {
        onSuccess: (data) => {
          if (data?.message) {
            message.success(data.message);
            setOtpDigits(['', '', '', '', '', '']);
            setStep('otp');
            setOtpDeadline(data.otpExpiresAt, data.serverTime);
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

  const handleVerifyOtp = (otpFromInput: string) => {
    if (verifyOtpMutation.isPending) return;

    if (!/^\d{6}$/.test(otpFromInput)) {
      setError(t('auth.invalidOtp'));
      return;
    }

    setError('');
    verifyOtpMutation.mutate(
      {
        email: formValues.email.trim(),
        otp: otpFromInput,
      },
      {
        onSuccess: (data) => {
          if (data?.message) {
            message.success(t('auth.registerSuccess'));
            setError('');
            localStorage.removeItem(OTP_SESSION_KEY);
            onRegisterSuccess?.(formValues.email.trim());
          } else {
            setError(t('auth.registerFailed'));
          }
        },
        onError: (err: unknown) => {
          const errorMessage = getApiErrorMessage(
            err,
            t('auth.verifyOtpFailed'),
          );
          if (isWrongOtpError(errorMessage)) {
            setOtpDigits(['', '', '', '', '', '']);
          }
          setError(errorMessage);
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (!canResend || resendOtpMutation.isPending) return;
    setError('');
    resendOtpMutation.mutate(formValues.email.trim(), {
      onSuccess: (data) => {
        message.success(data.message || t('auth.resendOtpSuccess'));
        setOtpDigits(['', '', '', '', '', '']);
        setOtpDeadline(data.otpExpiresAt, data.serverTime);
      },
      onError: (err: unknown) => {
        setError(getApiErrorMessage(err, t('auth.resendOtpFailed')));
      },
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {step === 'form' ? (
        <RegisterForm
          initialValues={formValues}
          loading={registerMutation.isPending}
          onSubmit={handleRegister}
        />
      ) : (
        <OtpSection
          t={t}
          otpDigits={otpDigits}
          resendLoading={resendOtpMutation.isPending}
          remainingSeconds={remainingSeconds}
          canResend={canResend}
          setOtpDigits={setOtpDigits}
          error={error}
          setError={setError}
          onVerified={handleVerifyOtp}
          onResend={handleResendOtp}
          loading={verifyOtpMutation.isPending}
          onBack={() => {
            deleteUserMutation.mutate();
          }}
        />
      )}
    </div>
  );
};

export default RegisterContainer;
