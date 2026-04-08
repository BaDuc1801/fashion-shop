import { AxiosError } from 'axios';

export type ApiErrorResponse = {
  message?: string;
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};
