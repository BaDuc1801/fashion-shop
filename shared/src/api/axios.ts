import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { useAuthStore } from '../stores';
import { t } from 'i18next';
import { authEvent } from '../utils/authEvent';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'cache-control': 'no-cache',
  },
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let isAuthFailed = false;

let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => {
    p.reject(error);
  });

  failedQueue = [];
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    isRefreshing = true;

    refreshPromise = api
      .post(
        `${import.meta.env.VITE_API_URL}/api/users/refresh`,
        {},
        { withCredentials: true },
      )
      .then(() => {
        processQueue(null);
      })
      .catch((err) => {
        isAuthFailed = true;
        processQueue(err);
        throw err;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (isAuthFailed) {
      return Promise.reject(error);
    }

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes('/api/users/refresh')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      await refreshAccessToken();
      return api(originalRequest);
    } catch (err) {
      isAuthFailed = true;

      message.error(t('sessionExpired'), 5);

      useAuthStore.getState().clearSession();
      localStorage.clear();
      sessionStorage.clear();

      authEvent.dispatchEvent(new Event('session-expired'));

      return Promise.reject(err);
    }
  },
);

export default api;
