import axios from 'axios';

let bearerToken: string | null = null;

export const setApiBearerToken = (token: string | null) => {
  bearerToken = token;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (bearerToken) {
    config.headers.Authorization = `Bearer ${bearerToken}`;
  }
  return config;
});

export default api;
