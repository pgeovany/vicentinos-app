import axios from 'axios';
import { auth } from '@/lib/auth/auth';
import { ApiError } from './types';

export const api = axios.create({
  baseURL: process.env.API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = await auth.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await auth.removeToken();
    }

    const message = error.response?.data?.message ?? error.message;
    const statusCode = error.response?.status ?? 500;

    return Promise.reject(new ApiError(message, statusCode));
  },
);
