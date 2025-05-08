export const authConfig = {
  publicPaths: ['/login', '/transparencia'],
  protectedPaths: ['/app/'],
  defaultProtectedPath: '/app/produtos/estoque',
  defaultPublicPath: '/transparencia/produtos',
  get matcher() {
    return [...this.protectedPaths.map((path) => `${path}/:path*`), '/login'];
  },
};

export function isProtectedRoute(pathname: string): boolean {
  return authConfig.protectedPaths.some((protectedPath) => pathname.startsWith(protectedPath));
}
