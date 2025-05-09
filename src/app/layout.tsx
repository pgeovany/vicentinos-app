import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LayoutContent } from '@/components/layout-content';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vicentinos - Paróquia Nossa Senhora da Conceição',
  description:
    'Ajude-nos a ajudar quem mais precisa. Cada doação transforma vidas e leva esperança para famílias em necessidade.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://vicentinos.vercel.app'),
  openGraph: {
    title: 'Sua doação transforma vidas',
    description:
      'Ajude-nos a ajudar quem mais precisa. Veja os produtos que mais necessitamos no momento.',
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://vicentinos.vercel.app',
    siteName: 'Vicentinos - Paróquia Nossa Senhora da Conceição',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Vicentinos - Paróquia Nossa Senhora da Conceição',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sua doação transforma vidas',
    description:
      'Ajude-nos a ajudar quem mais precisa. Veja os produtos que mais necessitamos no momento.',
    images: ['/api/og'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
