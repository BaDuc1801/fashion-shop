import { Button, Input, InputRef } from 'antd';
import { TFunction } from 'i18next';
import { useEffect, useRef } from 'react';

type OtpSectionProps = {
  t: TFunction;
  otpDigits: string[];
  loading: boolean;
  setOtpDigits: (digits: string[]) => void;
  error: string;
  setError: (error: string) => void;
  onVerified?: () => void;
};

const OtpSection = ({
  t,
  otpDigits,
  loading,
  setOtpDigits,
  error,
  setError,
  onVerified,
}: OtpSectionProps) => {
  const otpRefs = useRef<Array<InputRef | null>>([]);

  const handleVerifyOtp = () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setError(t('auth.invalidOtp'));
      return;
    }
    setError('');
    onVerified?.();
  };

  useEffect(() => {
    const otp = otpDigits.join('');
    if (otp.length === 6 && !loading) {
      setError('');
      onVerified?.();
    }
  }, [loading, onVerified, otpDigits, setError]);

  const handleOtpChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = nextValue;
    setOtpDigits(nextDigits);

    if (nextValue && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
      .split('');
    if (!pasted.length) return;
    const nextDigits = ['', '', '', '', '', ''];
    pasted.forEach((v, i) => {
      nextDigits[i] = v;
    });
    setOtpDigits(nextDigits);
    otpRefs.current[Math.min(5, pasted.length - 1)]?.focus();
  };

  return (
    <div className="mt-8 space-y-8">
      <p className="text-sm text-slate-600">{t('auth.otpHint')}</p>
      <div className="flex items-center justify-center gap-2">
        {otpDigits.map((digit, index) => (
          <Input
            key={index}
            size="large"
            value={digit}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            onPaste={handleOtpPaste}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            ref={(el) => {
              otpRefs.current[index] = el;
            }}
            className="h-12 w-12 !text-center"
          />
        ))}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button
        type="primary"
        size="large"
        loading={loading}
        disabled={loading}
        className="!h-11 w-full rounded-md !bg-[#a66e7f] hover:!bg-[#8d5c6d]"
        onClick={handleVerifyOtp}
      >
        {t('auth.verifyOtp')}
      </Button>
    </div>
  );
};

export default OtpSection;
