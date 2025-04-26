import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cadastro de assistidos',
};

export default function CadastroBeneficiarioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
