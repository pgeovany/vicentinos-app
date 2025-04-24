export const authConfig = {
  publicPaths: ['/login', '/transparencia'],
  protectedPaths: ['/beneficiarios', '/produtos', '/doacoes', '/cestas', '/sos', '/painel'],
  defaultProtectedPath: '/produtos/estoque',
  get matcher() {
    return [...this.protectedPaths.map((path) => `${path}/:path*`), '/login'];
  },
};

export function isProtectedRoute(pathname: string): boolean {
  return authConfig.protectedPaths.some((protectedPath) => pathname.startsWith(protectedPath));
}
