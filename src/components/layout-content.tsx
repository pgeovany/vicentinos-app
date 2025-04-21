'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { isProtectedRoute } from '@/config/auth';

export function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (isProtectedRoute(pathname)) {
    return (
      <>
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-y-auto p-4">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </>
    );
  }

  return <main className="flex flex-1 flex-col overflow-y-auto p-4">{children}</main>;
}
