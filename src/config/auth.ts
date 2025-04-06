export const authConfig = {
  publicPaths: ['/login', '/transparencia'],
  protectedPaths: [
    '/beneficiarios',
    '/produtos',
    '/doacoes',
    '/cestas',
    '/sos',
    '/painel',
  ],
  defaultProtectedPath: '/painel',
  get matcher() {
    return [...this.protectedPaths.map((path) => `${path}/:path*`), '/login'];
  },
};
