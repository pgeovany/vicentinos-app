'use server';

import { cookies } from 'next/headers';
import { LoginDto } from '@/api/login/schemas';
import { loginApi } from '@/api/login';
import { jwtVerify } from 'jose';

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

    (await cookies()).set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Erro ao realizar login' };
  }
}
