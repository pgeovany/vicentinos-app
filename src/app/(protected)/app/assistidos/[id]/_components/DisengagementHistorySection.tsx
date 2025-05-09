'use client';

import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { formatDate } from '@/lib/format-date';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DisengagementHistorySectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
}

export function DisengagementHistorySection({ beneficiario }: DisengagementHistorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de desligamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {beneficiario.historicoDesligamentos && beneficiario.historicoDesligamentos.length > 0 ? (
          <div className="space-y-4">
            {beneficiario.historicoDesligamentos.map((desligamento) => (
              <div key={desligamento.id} className="space-y-2">
                <p className="font-medium">Desligamento: {formatDate(desligamento.criadoEm)}</p>
                {desligamento.motivo && (
                  <p className="text-sm text-muted-foreground">Motivo: {desligamento.motivo}</p>
                )}
                <Separator />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Este assistido não possui histórico de desligamentos
          </p>
        )}
      </CardContent>
    </Card>
  );
}
