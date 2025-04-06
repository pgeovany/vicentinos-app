import axios from 'axios';
import { auth } from '@/lib/auth/auth';

export const api = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(error.message)
    );
  }
);
