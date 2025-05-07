'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BeneficiarioFormData } from '../types';

interface BenefitsStepProps {
  formData: BeneficiarioFormData;
  updateFormData: (data: Partial<BeneficiarioFormData>) => void;
}

export function BenefitsStep({ formData, updateFormData }: BenefitsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>Selecione os benefícios sociais que o assistido possui.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Benefícios Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="bolsaFamilia">Bolsa Família</Label>
            <Switch
              id="bolsaFamilia"
              checked={formData.bolsaFamilia}
              onCheckedChange={(checked) => updateFormData({ bolsaFamilia: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cadUnico">CadÚnico</Label>
            <Switch
              id="cadUnico"
              checked={formData.cadUnico}
              onCheckedChange={(checked) => updateFormData({ cadUnico: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="loas">LOAS</Label>
            <Switch
              id="loas"
              checked={formData.loas}
              onCheckedChange={(checked) => updateFormData({ loas: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="carteiraIdoso">Carteira do Idoso</Label>
            <Switch
              id="carteiraIdoso"
              checked={formData.carteiraIdoso}
              onCheckedChange={(checked) => updateFormData({ carteiraIdoso: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cartaoFamiliaCarioca">Cartão Família Carioca</Label>
            <Switch
              id="cartaoFamiliaCarioca"
              checked={formData.cartaoFamiliaCarioca}
              onCheckedChange={(checked) => updateFormData({ cartaoFamiliaCarioca: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="minhaCasaMinhaVida">Minha Casa Minha Vida</Label>
            <Switch
              id="minhaCasaMinhaVida"
              checked={formData.minhaCasaMinhaVida}
              onCheckedChange={(checked) => updateFormData({ minhaCasaMinhaVida: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="paif">PAIF</Label>
            <Switch
              id="paif"
              checked={formData.paif}
              onCheckedChange={(checked) => updateFormData({ paif: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="pronatec">PRONATEC</Label>
            <Switch
              id="pronatec"
              checked={formData.pronatec}
              onCheckedChange={(checked) => updateFormData({ pronatec: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="aposentadoria">Aposentadoria</Label>
            <Switch
              id="aposentadoria"
              checked={formData.aposentadoria}
              onCheckedChange={(checked) => updateFormData({ aposentadoria: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isencaoConcursoPublico">Isenção de Concurso Público</Label>
            <Switch
              id="isencaoConcursoPublico"
              checked={formData.isencaoConcursoPublico}
              onCheckedChange={(checked) => updateFormData({ isencaoConcursoPublico: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cadastroParaEmprego">Cadastro para Emprego</Label>
            <Switch
              id="cadastroParaEmprego"
              checked={formData.cadastroParaEmprego}
              onCheckedChange={(checked) => updateFormData({ cadastroParaEmprego: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="tarifaSocialEnergiaEletrica">Tarifa Social de Energia Elétrica</Label>
            <Switch
              id="tarifaSocialEnergiaEletrica"
              checked={formData.tarifaSocialEnergiaEletrica}
              onCheckedChange={(checked) =>
                updateFormData({ tarifaSocialEnergiaEletrica: checked })
              }
            />
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Label htmlFor="outrosBeneficios">Outros Benefícios</Label>
          <Input
            id="outrosBeneficios"
            value={formData.outrosBeneficios || ''}
            onChange={(e) => updateFormData({ outrosBeneficios: e.target.value })}
            placeholder="Outros benefícios sociais"
          />
        </div>

        <div className="pt-4 space-y-2">
          <Label htmlFor="beneficiosObservacao">Observações</Label>
          <Textarea
            id="beneficiosObservacao"
            value={formData.beneficiosObservacao || ''}
            onChange={(e) => updateFormData({ beneficiosObservacao: e.target.value })}
            placeholder="Observações sobre os benefícios sociais"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
