'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { detalharBeneficiario } from '../../lista/actions';
import { formatDate } from '@/lib/format-date';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  renderOptionalField,
  renderOptionalDate,
} from '@/lib/render-optional-fields';
import { addCpfMask } from '@/lib/add-cpf-mask';
import { addPhoneMask } from '@/lib/add-phone-mask';

export function BeneficiarioDetalhes({
  beneficiarioId,
}: Readonly<{
  beneficiarioId: string;
}>) {
  const [beneficiario, setBeneficiario] =
    useState<BeneficiarioComHistoricoResponse | null>(null);

  useEffect(() => {
    const fetchBeneficiario = async () => {
      const response = await detalharBeneficiario(beneficiarioId);

      if (response?.success) {
        setBeneficiario(response.data);
      } else {
        toast.error(response?.error ?? 'Erro ao carregar beneficiário');
      }
    };

    fetchBeneficiario();
  }, [beneficiarioId]);

  if (!beneficiario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {renderOptionalField(beneficiario.nome, 'Nome')}
            {renderOptionalField(addCpfMask(beneficiario.cpf ?? ''), 'CPF')}
            {renderOptionalDate(
              beneficiario.dataNascimento,
              'Data de Nascimento'
            )}
            {renderOptionalField(beneficiario.status?.toLowerCase(), 'Status')}
            {renderOptionalField(
              addPhoneMask(beneficiario.telefone ?? ''),
              'Telefone'
            )}
            {renderOptionalField(beneficiario.email, 'Email')}
            {renderOptionalDate(beneficiario.criadoEm, 'Cadastrado em')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {beneficiario.endereco?.rua && beneficiario.endereco?.numero ? (
              <p>
                {beneficiario.endereco.rua}, {beneficiario.endereco.numero}
                {beneficiario.endereco.complemento &&
                  ` - ${beneficiario.endereco.complemento}`}
              </p>
            ) : (
              <p>Endereço não informado</p>
            )}
            {beneficiario.endereco?.bairro && beneficiario.endereco?.cidade ? (
              <p>
                {beneficiario.endereco.bairro} - {beneficiario.endereco.cidade}
              </p>
            ) : null}
            {beneficiario.endereco?.cep && (
              <p>CEP: {beneficiario.endereco.cep}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dependentes</CardTitle>
        </CardHeader>
        <CardContent>
          {beneficiario.dependentes.length > 0 ? (
            <div className="space-y-4">
              {beneficiario.dependentes.map((dependente) => (
                <div key={dependente.id} className="space-y-2">
                  <p className="font-medium">{dependente.nome}</p>
                  {dependente.parentesco && (
                    <p className="text-sm text-muted-foreground">
                      Parentesco: {dependente.parentesco}
                    </p>
                  )}
                  <Separator />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Nenhum dependente cadastrado
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de cestas recebidas</CardTitle>
        </CardHeader>
        <CardContent>
          {beneficiario.historicoRecebimentos.length > 0 ? (
            <div className="space-y-4">
              {beneficiario.historicoRecebimentos.map((historico) => (
                <div key={historico.id} className="space-y-2">
                  <p className="font-medium">
                    Cesta recebida: {historico.nomeCesta}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Data: {formatDate(historico.criadoEm)}
                  </p>
                  <Separator />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Este beneficiário ainda não recebeu nenhuma cesta
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
