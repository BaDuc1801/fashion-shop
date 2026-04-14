import { Input } from 'antd';
import type { InputRef } from 'antd';
import { useRef } from 'react';

type OtpCodeInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  length?: number;
};

const OtpCodeInput = ({
  value,
  onChange,
  disabled = false,
  length = 6,
}: OtpCodeInputProps) => {
  const refs = useRef<Array<InputRef | null>>([]);

  const safeDigits = Array.from({ length }, (_, i) => value[i] ?? '');

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...safeDigits];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && !safeDigits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length)
      .split('');
    if (!pasted.length) return;
    const next = Array.from({ length }, (_, i) => pasted[i] ?? '');
    onChange(next);
    refs.current[Math.min(length - 1, pasted.length - 1)]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {safeDigits.map((digit, index) => (
        <Input
          key={index}
          size="large"
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          className="h-11 w-11 !text-center"
          onPaste={handlePaste}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          ref={(instance) => {
            refs.current[index] = instance;
          }}
        />
      ))}
    </div>
  );
};

export default OtpCodeInput;
