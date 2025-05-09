'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BeneficiarioFormData } from '../types';

interface HealthStepProps {
  formData: BeneficiarioFormData;
  updateFormData: (data: Partial<BeneficiarioFormData>) => void;
}

export function HealthStep({ formData, updateFormData }: HealthStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>Informações sobre saúde do assistido.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações de Saúde</h3>

        <div className="flex items-center justify-between">
          <Label htmlFor="cartaoSUS">Possui Cartão SUS?</Label>
          <Switch
            id="cartaoSUS"
            checked={formData.cartaoSUS}
            onCheckedChange={(checked) => updateFormData({ cartaoSUS: checked })}
          />
        </div>

        {formData.cartaoSUS && (
          <div className="space-y-2">
            <Label htmlFor="numeroCartaoSUS">Número do Cartão SUS</Label>
            <Input
              id="numeroCartaoSUS"
              value={formData.numeroCartaoSUS || ''}
              onChange={(e) => updateFormData({ numeroCartaoSUS: e.target.value })}
              placeholder="Número do Cartão SUS"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="clinicaFamilia">Clínica da Família</Label>
          <Input
            id="clinicaFamilia"
            value={formData.clinicaFamilia || ''}
            onChange={(e) => updateFormData({ clinicaFamilia: e.target.value })}
            placeholder="Nome da Clínica da Família"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postoSaude">Posto de Saúde</Label>
          <Input
            id="postoSaude"
            value={formData.postoSaude || ''}
            onChange={(e) => updateFormData({ postoSaude: e.target.value })}
            placeholder="Nome do Posto de Saúde"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="tratamentoHospitalar">Em tratamento hospitalar?</Label>
          <Switch
            id="tratamentoHospitalar"
            checked={formData.tratamentoHospitalar}
            onCheckedChange={(checked) => updateFormData({ tratamentoHospitalar: checked })}
          />
        </div>

        {formData.tratamentoHospitalar && (
          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital</Label>
            <Input
              id="hospital"
              value={formData.hospital || ''}
              onChange={(e) => updateFormData({ hospital: e.target.value })}
              placeholder="Nome do Hospital"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tratamentoSaude">Tratamento de Saúde</Label>
          <Textarea
            id="tratamentoSaude"
            value={formData.tratamentoSaude || ''}
            onChange={(e) => updateFormData({ tratamentoSaude: e.target.value })}
            placeholder="Descrição do tratamento de saúde"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicamentos">Medicamentos</Label>
          <Textarea
            id="medicamentos"
            value={formData.medicamentos || ''}
            onChange={(e) => updateFormData({ medicamentos: e.target.value })}
            placeholder="Medicamentos em uso"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="saudeObservacao">Observações</Label>
          <Textarea
            id="saudeObservacao"
            value={formData.saudeObservacao || ''}
            onChange={(e) => updateFormData({ saudeObservacao: e.target.value })}
            placeholder="Observações sobre a saúde"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
