'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { detalharBeneficiario } from '../../actions';
import { PersonalInfoSection } from './PersonalInfoSection';
import { AddressSection } from './AddressSection';
import { DependentsSection } from './DependentsSection';
import { HistorySection } from './HistorySection';
import { SocialBenefitsSection } from './SocialBenefitsSection';
import { HealthInfoSection } from './HealthInfoSection';
import { InterestsSection } from './InterestsSection';
import { DisengagementHistorySection } from './DisengagementHistorySection';

export function BeneficiarioDetalhes({
  beneficiarioId,
}: Readonly<{
  beneficiarioId: string;
}>) {
  const [beneficiario, setBeneficiario] = useState<BeneficiarioComHistoricoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBeneficiario = async () => {
    setLoading(true);
    const response = await detalharBeneficiario(beneficiarioId);

    if (response?.success && response.data) {
      setBeneficiario(response.data);
    } else {
      toast.error(response?.error ?? 'Erro ao carregar assistido');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBeneficiario();
  }, [beneficiarioId]); // eslint-disable-line

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  if (!beneficiario) {
    return <div>Assistido não encontrado</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <PersonalInfoSection
        beneficiario={beneficiario}
        beneficiarioId={beneficiarioId}
        onRefresh={fetchBeneficiario}
      />
      <AddressSection
        beneficiario={beneficiario}
        beneficiarioId={beneficiarioId}
        onRefresh={fetchBeneficiario}
      />
      <SocialBenefitsSection
        beneficiario={beneficiario}
        beneficiarioId={beneficiarioId}
        onRefresh={fetchBeneficiario}
      />
      <HealthInfoSection
        beneficiario={beneficiario}
        beneficiarioId={beneficiarioId}
        onRefresh={fetchBeneficiario}
      />
      <InterestsSection
        beneficiario={beneficiario}
        beneficiarioId={beneficiarioId}
        onRefresh={fetchBeneficiario}
      />
      <DependentsSection
        beneficiario={beneficiario}
        beneficiarioId={beneficiarioId}
        onRefresh={fetchBeneficiario}
      />
      <HistorySection beneficiario={beneficiario} />
      <DisengagementHistorySection beneficiario={beneficiario} />
    </div>
  );
}
