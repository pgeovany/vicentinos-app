import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth_token';

export const auth = {
  setToken(token: string) {
    Cookies.set(AUTH_TOKEN_KEY, token, {
      expires: 60,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  },

  getToken() {
    return Cookies.get(AUTH_TOKEN_KEY);
  },

  removeToken() {
    Cookies.remove(AUTH_TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
