import { BeneficiarioDetalhes } from './_components/BeneficiarioDetalhes';

export default async function BeneficiarioPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return <BeneficiarioDetalhes beneficiarioId={id} />;
}
