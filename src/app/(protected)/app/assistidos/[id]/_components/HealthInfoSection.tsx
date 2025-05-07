'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { atualizarSaude } from '../../actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { EditCard } from './EditCard';
import { Textarea } from '@/components/ui/textarea';

interface HealthInfoSectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => void;
}

export function HealthInfoSection({
  beneficiario,
  beneficiarioId,
  onRefresh,
}: HealthInfoSectionProps) {
  const [editing, setEditing] = useState(false);
  const [healthData, setHealthData] = useState({
    cartaoSUS: beneficiario.saude?.cartaoSUS || false,
    numeroCartaoSUS: beneficiario.saude?.numeroCartaoSUS || '',
    clinicaFamilia: beneficiario.saude?.clinicaFamilia || '',
    postoSaude: beneficiario.saude?.postoSaude || '',
    tratamentoHospitalar: beneficiario.saude?.tratamentoHospitalar || false,
    hospital: beneficiario.saude?.hospital || '',
    tratamentoSaude: beneficiario.saude?.tratamentoSaude || '',
    medicamentos: beneficiario.saude?.medicamentos || '',
    observacao: beneficiario.saude?.observacao || '',
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setHealthData({
      cartaoSUS: beneficiario.saude?.cartaoSUS || false,
      numeroCartaoSUS: beneficiario.saude?.numeroCartaoSUS || '',
      clinicaFamilia: beneficiario.saude?.clinicaFamilia || '',
      postoSaude: beneficiario.saude?.postoSaude || '',
      tratamentoHospitalar: beneficiario.saude?.tratamentoHospitalar || false,
      hospital: beneficiario.saude?.hospital || '',
      tratamentoSaude: beneficiario.saude?.tratamentoSaude || '',
      medicamentos: beneficiario.saude?.medicamentos || '',
      observacao: beneficiario.saude?.observacao || '',
    });
  };

  const handleSave = async () => {
    const response = await atualizarSaude({
      beneficiarioId: beneficiarioId,
      body: {
        ...healthData,
      },
    });

    if (response?.success) {
      toast.success('Informações de saúde atualizadas com sucesso');
      onRefresh();
      setEditing(false);
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar informações de saúde');
    }
  };

  const renderSwitchField = (value: boolean) => {
    return (
      <div className="flex items-center space-x-2">
        <Switch className="cursor-pointer" checked={value} disabled />
        <Label>{value ? 'Sim' : 'Não'}</Label>
      </div>
    );
  };

  return (
    <EditCard
      title="Informações de Saúde"
      isEditing={editing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium">Cartão SUS:</span>
              {renderSwitchField(beneficiario.saude?.cartaoSUS || false)}
            </div>

            {beneficiario.saude?.cartaoSUS && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Número do Cartão SUS:</span>
                <p className="text-sm">{beneficiario.saude?.numeroCartaoSUS || 'Não informado'}</p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-sm font-medium">Clínica da Família:</span>
              <p className="text-sm">{beneficiario.saude?.clinicaFamilia || 'Não informado'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium">Posto de Saúde:</span>
              <p className="text-sm">{beneficiario.saude?.postoSaude || 'Não informado'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium">Tratamento Hospitalar:</span>
              {renderSwitchField(beneficiario.saude?.tratamentoHospitalar || false)}
            </div>

            {beneficiario.saude?.tratamentoHospitalar && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Hospital:</span>
                <p className="text-sm">{beneficiario.saude?.hospital || 'Não informado'}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Tratamentos de Saúde:</span>
            <p className="text-sm">{beneficiario.saude?.tratamentoSaude || 'Não informado'}</p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Medicamentos:</span>
            <p className="text-sm">{beneficiario.saude?.medicamentos || 'Não informado'}</p>
          </div>

          {beneficiario.saude?.observacao && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Observações:</span>
              <p className="text-sm">{beneficiario.saude.observacao}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="cartaoSUS"
                  checked={healthData.cartaoSUS}
                  onCheckedChange={(checked) =>
                    setHealthData({ ...healthData, cartaoSUS: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="cartaoSUS">Cartão SUS</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroCartaoSUS">Número do Cartão SUS</Label>
              <Input
                id="numeroCartaoSUS"
                value={healthData.numeroCartaoSUS}
                onChange={(e) => setHealthData({ ...healthData, numeroCartaoSUS: e.target.value })}
                placeholder="Número do Cartão SUS"
                disabled={!healthData.cartaoSUS}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicaFamilia">Clínica da Família</Label>
              <Input
                id="clinicaFamilia"
                value={healthData.clinicaFamilia}
                onChange={(e) => setHealthData({ ...healthData, clinicaFamilia: e.target.value })}
                placeholder="Nome da Clínica da Família"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postoSaude">Posto de Saúde</Label>
              <Input
                id="postoSaude"
                value={healthData.postoSaude}
                onChange={(e) => setHealthData({ ...healthData, postoSaude: e.target.value })}
                placeholder="Nome do Posto de Saúde"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="tratamentoHospitalar"
                  checked={healthData.tratamentoHospitalar}
                  onCheckedChange={(checked) =>
                    setHealthData({ ...healthData, tratamentoHospitalar: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="tratamentoHospitalar">Tratamento Hospitalar</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Input
                id="hospital"
                value={healthData.hospital}
                onChange={(e) => setHealthData({ ...healthData, hospital: e.target.value })}
                placeholder="Nome do Hospital"
                disabled={!healthData.tratamentoHospitalar}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tratamentoSaude">Tratamentos de Saúde</Label>
            <Textarea
              id="tratamentoSaude"
              value={healthData.tratamentoSaude}
              onChange={(e) => setHealthData({ ...healthData, tratamentoSaude: e.target.value })}
              placeholder="Descreva os tratamentos de saúde"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicamentos">Medicamentos</Label>
            <Textarea
              id="medicamentos"
              value={healthData.medicamentos}
              onChange={(e) => setHealthData({ ...healthData, medicamentos: e.target.value })}
              placeholder="Liste os medicamentos utilizados"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              value={healthData.observacao}
              onChange={(e) => setHealthData({ ...healthData, observacao: e.target.value })}
              placeholder="Observações sobre a saúde"
            />
          </div>
        </div>
      )}
    </EditCard>
  );
}
