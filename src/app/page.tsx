import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vicentinos - Paróquia Nossa Senhora da Conceição',
  description:
    'Ajude-nos a ajudar quem mais precisa. Cada doação transforma vidas e leva esperança para famílias em necessidade.',
  openGraph: {
    title: 'Vicentinos - Sua doação transforma vidas',
    description:
      'Ajude-nos a ajudar quem mais precisa. Conheça os produtos que mais necessitamos no momento.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://vicentinos-app.vercel.app',
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
    title: 'Vicentinos - Sua doação transforma vidas',
    description:
      'Ajude-nos a ajudar quem mais precisa. Conheça os produtos que mais necessitamos no momento.',
    images: ['/api/og'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};
