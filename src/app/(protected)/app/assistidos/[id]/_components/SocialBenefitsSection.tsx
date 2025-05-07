'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { atualizarBeneficiosSociais } from '../../actions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EditCard } from './EditCard';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface SocialBenefitsSectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => void;
}

export function SocialBenefitsSection({
  beneficiario,
  beneficiarioId,
  onRefresh,
}: SocialBenefitsSectionProps) {
  const isMobile = useIsMobile();
  const [editing, setEditing] = useState(false);
  const [benefitsData, setBenefitsData] = useState({
    bolsaFamilia: beneficiario.beneficiosSociais?.bolsaFamilia || false,
    cadUnico: beneficiario.beneficiosSociais?.cadUnico || false,
    loas: beneficiario.beneficiosSociais?.loas || false,
    carteiraIdoso: beneficiario.beneficiosSociais?.carteiraIdoso || false,
    cartaoFamiliaCarioca: beneficiario.beneficiosSociais?.cartaoFamiliaCarioca || false,
    minhaCasaMinhaVida: beneficiario.beneficiosSociais?.minhaCasaMinhaVida || false,
    paif: beneficiario.beneficiosSociais?.paif || false,
    pronatec: beneficiario.beneficiosSociais?.pronatec || false,
    aposentadoria: beneficiario.beneficiosSociais?.aposentadoria || false,
    isencaoConcursoPublico: beneficiario.beneficiosSociais?.isencaoConcursoPublico || false,
    cadastroParaEmprego: beneficiario.beneficiosSociais?.cadastroParaEmprego || false,
    tarifaSocialEnergiaEletrica:
      beneficiario.beneficiosSociais?.tarifaSocialEnergiaEletrica || false,
    outrosBeneficios: beneficiario.beneficiosSociais?.outrosBeneficios || '',
    observacao: beneficiario.beneficiosSociais?.observacao || '',
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setBenefitsData({
      bolsaFamilia: beneficiario.beneficiosSociais?.bolsaFamilia || false,
      cadUnico: beneficiario.beneficiosSociais?.cadUnico || false,
      loas: beneficiario.beneficiosSociais?.loas || false,
      carteiraIdoso: beneficiario.beneficiosSociais?.carteiraIdoso || false,
      cartaoFamiliaCarioca: beneficiario.beneficiosSociais?.cartaoFamiliaCarioca || false,
      minhaCasaMinhaVida: beneficiario.beneficiosSociais?.minhaCasaMinhaVida || false,
      paif: beneficiario.beneficiosSociais?.paif || false,
      pronatec: beneficiario.beneficiosSociais?.pronatec || false,
      aposentadoria: beneficiario.beneficiosSociais?.aposentadoria || false,
      isencaoConcursoPublico: beneficiario.beneficiosSociais?.isencaoConcursoPublico || false,
      cadastroParaEmprego: beneficiario.beneficiosSociais?.cadastroParaEmprego || false,
      tarifaSocialEnergiaEletrica:
        beneficiario.beneficiosSociais?.tarifaSocialEnergiaEletrica || false,
      outrosBeneficios: beneficiario.beneficiosSociais?.outrosBeneficios || '',
      observacao: beneficiario.beneficiosSociais?.observacao || '',
    });
  };

  const handleSave = async () => {
    const response = await atualizarBeneficiosSociais({
      beneficiarioId: beneficiarioId,
      body: {
        ...benefitsData,
      },
    });

    if (response?.success) {
      toast.success('Benefícios sociais atualizados com sucesso');
      onRefresh();
      setEditing(false);
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar benefícios sociais');
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

  const gridCols = isMobile ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <EditCard
      title="Benefícios Sociais"
      isEditing={editing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!editing ? (
        <div className="space-y-4">
          <div className={`grid ${gridCols} gap-4`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bolsa Família:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.bolsaFamilia || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cadastro Único:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.cadUnico || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">LOAS:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.loas || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Carteira do Idoso:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.carteiraIdoso || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cartão Família Carioca:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.cartaoFamiliaCarioca || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Minha Casa Minha Vida:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.minhaCasaMinhaVida || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">PAIF:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.paif || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pronatec:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.pronatec || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Aposentadoria:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.aposentadoria || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Isenção Concurso Público:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.isencaoConcursoPublico || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cadastro para Emprego:</span>
                {renderSwitchField(beneficiario.beneficiosSociais?.cadastroParaEmprego || false)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tarifa Social de Energia Elétrica:</span>
                {renderSwitchField(
                  beneficiario.beneficiosSociais?.tarifaSocialEnergiaEletrica || false,
                )}
              </div>
            </div>
          </div>

          {beneficiario.beneficiosSociais?.outrosBeneficios && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Outros Benefícios:</span>
              <p className="text-sm">{beneficiario.beneficiosSociais.outrosBeneficios}</p>
            </div>
          )}

          {beneficiario.beneficiosSociais?.observacao && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Observações:</span>
              <p className="text-sm">{beneficiario.beneficiosSociais.observacao}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`grid ${gridCols} gap-4`}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="bolsaFamilia"
                  checked={benefitsData.bolsaFamilia}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, bolsaFamilia: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="bolsaFamilia">Bolsa Família</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="cadUnico"
                  checked={benefitsData.cadUnico}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, cadUnico: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="cadUnico">Cadastro Único</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="loas"
                  checked={benefitsData.loas}
                  onCheckedChange={(checked) => setBenefitsData({ ...benefitsData, loas: checked })}
                  className="cursor-pointer"
                />
                <Label htmlFor="loas">LOAS</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="carteiraIdoso"
                  checked={benefitsData.carteiraIdoso}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, carteiraIdoso: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="carteiraIdoso">Carteira do Idoso</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="cartaoFamiliaCarioca"
                  checked={benefitsData.cartaoFamiliaCarioca}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, cartaoFamiliaCarioca: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="cartaoFamiliaCarioca">Cartão Família Carioca</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="minhaCasaMinhaVida"
                  checked={benefitsData.minhaCasaMinhaVida}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, minhaCasaMinhaVida: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="minhaCasaMinhaVida">Minha Casa Minha Vida</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="paif"
                  checked={benefitsData.paif}
                  onCheckedChange={(checked) => setBenefitsData({ ...benefitsData, paif: checked })}
                  className="cursor-pointer"
                />
                <Label htmlFor="paif">PAIF</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pronatec"
                  checked={benefitsData.pronatec}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, pronatec: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="pronatec">Pronatec</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="aposentadoria"
                  checked={benefitsData.aposentadoria}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, aposentadoria: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="aposentadoria">Aposentadoria</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isencaoConcursoPublico"
                  checked={benefitsData.isencaoConcursoPublico}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, isencaoConcursoPublico: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="isencaoConcursoPublico">Isenção Concurso Público</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="cadastroParaEmprego"
                  checked={benefitsData.cadastroParaEmprego}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, cadastroParaEmprego: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="cadastroParaEmprego">Cadastro para Emprego</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="tarifaSocialEnergiaEletrica"
                  checked={benefitsData.tarifaSocialEnergiaEletrica}
                  onCheckedChange={(checked) =>
                    setBenefitsData({ ...benefitsData, tarifaSocialEnergiaEletrica: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="tarifaSocialEnergiaEletrica">
                  Tarifa Social de Energia Elétrica
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outrosBeneficios">Outros Benefícios</Label>
            <Textarea
              id="outrosBeneficios"
              value={benefitsData.outrosBeneficios}
              onChange={(e) =>
                setBenefitsData({ ...benefitsData, outrosBeneficios: e.target.value })
              }
              placeholder="Informe outros benefícios sociais"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              value={benefitsData.observacao}
              onChange={(e) => setBenefitsData({ ...benefitsData, observacao: e.target.value })}
              placeholder="Observações sobre os benefícios sociais"
            />
          </div>
        </div>
      )}
    </EditCard>
  );
}
