export const isWrongOtpError = (message: string) => {
  const normalized = message.toLowerCase();
  return normalized.includes('wrong otp') || normalized.includes('invalid otp');
};
