import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cadastro de Beneficiário',
};

export default function CadastroBeneficiarioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
