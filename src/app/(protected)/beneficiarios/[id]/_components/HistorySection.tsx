'use client';

import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { formatDate } from '@/lib/format-date';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface HistorySectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
}

export function HistorySection({ beneficiario }: HistorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de cestas recebidas</CardTitle>
      </CardHeader>
      <CardContent>
        {beneficiario.historicoRecebimentos.length > 0 ? (
          <div className="space-y-4">
            {beneficiario.historicoRecebimentos.map((historico) => (
              <div key={historico.id} className="space-y-2">
                <p className="font-medium">Cesta recebida: {historico.nomeCesta}</p>
                <p className="text-sm text-muted-foreground">
                  Data: {formatDate(historico.criadoEm)}
                </p>
                <Separator />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Este beneficiário ainda não recebeu nenhuma cesta</p>
        )}
      </CardContent>
    </Card>
  );
}
