'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { BeneficiarioRegisterForm } from './_components/BeneficiarioRegisterForm';

export default function CadastroBeneficiario() {
  const router = useRouter();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Cadastro de Beneficiário</h1>
      </div>

      <Card className="p-6">
        <BeneficiarioRegisterForm
          onComplete={() => {
            router.push('/beneficiarios/lista');
          }}
        />
      </Card>
    </div>
  );
}
