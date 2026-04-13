import { useEffect, useMemo, useState } from 'react';

export const useOtpCountdown = (active: boolean) => {
  const [otpDeadlineMs, setOtpDeadlineMs] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    if (!active || !otpDeadlineMs) return;
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active, otpDeadlineMs]);

  const remainingSeconds = useMemo(() => {
    if (!otpDeadlineMs) return 0;
    return Math.max(0, Math.ceil((otpDeadlineMs - nowMs) / 1000));
  }, [otpDeadlineMs, nowMs]);

  const setOtpDeadline = (otpExpiresAt?: string, serverTime?: string) => {
    if (!otpExpiresAt) {
      setOtpDeadlineMs(Date.now() + 5 * 60 * 1000);
      setNowMs(Date.now());
      return;
    }
    const expiresMs = new Date(otpExpiresAt).getTime();
    const serverMs = serverTime ? new Date(serverTime).getTime() : Date.now();
    const durationMs = Math.max(0, expiresMs - serverMs);
    setOtpDeadlineMs(Date.now() + durationMs);
    setNowMs(Date.now());
  };

  return {
    otpDeadlineMs,
    remainingSeconds,
    canResend: remainingSeconds <= 0,
    setOtpDeadline,
    setOtpDeadlineMs,
  };
};
