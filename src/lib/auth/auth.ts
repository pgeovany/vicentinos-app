import { cookies } from 'next/headers';

const AUTH_TOKEN_KEY = '__Host-auth_token';

export const auth = {
  async setToken(token: string, expiresIn?: number) {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_TOKEN_KEY, token, {
      maxAge: (expiresIn ?? 7) * 24 * 60 * 60,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      httpOnly: true,
    });
  },

  async getToken() {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_TOKEN_KEY)?.value;
  },

  async removeToken() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN_KEY);
  },

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  },
};
