'use server';

import { cookies } from 'next/headers';

export async function handleLogin(credentials: {
  email: string;
  senha: string;
}) {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Erro ao realizar login');
    }

    const data = await response.json();

    // Set the cookie server-side with HttpOnly flag
    (await cookies()).set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Erro ao realizar login' };
  }
}
