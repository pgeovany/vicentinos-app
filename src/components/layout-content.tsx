'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPublicRoute =
    pathname?.startsWith('/login') || pathname?.startsWith('/transparencia');

  if (isPublicRoute) {
    return (
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        {children}
      </main>
    );
  }

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
