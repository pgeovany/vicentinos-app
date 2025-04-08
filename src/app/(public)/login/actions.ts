'use server';

import { LoginDto } from '@/api/login/schemas';
import { loginApi } from '@/api/login';
import { jwtVerify } from 'jose';
import { ApiError } from '@/api/types';
import { auth } from '@/lib/auth/auth';

export async function handleLogin(credentials: LoginDto) {
  try {
    const { data } = await loginApi.login(credentials);

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { exp } = (await jwtVerify(data.token, secret)).payload;

    if (!exp) {
      throw new Error('Token inválido: sem data de expiração');
    }

    const now = Math.floor(Date.now() / 1000);
    const maxAge = exp - now;

    await auth.setToken(data.token, maxAge);

    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }

    console.error('Login error:', error);
    return { success: false, error: 'Erro ao realizar login' };
  }
}
