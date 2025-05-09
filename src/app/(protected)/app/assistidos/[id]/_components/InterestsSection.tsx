'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { atualizarInteresses } from '../../actions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EditCard } from './EditCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface InterestsSectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => void;
}

export function InterestsSection({
  beneficiario,
  beneficiarioId,
  onRefresh,
}: InterestsSectionProps) {
  const isMobile = useIsMobile();
  const [editing, setEditing] = useState(false);
  const [interestsData, setInterestsData] = useState({
    // Palestras
    programasSociais: beneficiario.interesses?.programasSociais || false,
    violenciaDomestica: beneficiario.interesses?.violenciaDomestica || false,
    dependenciaQuimica: beneficiario.interesses?.dependenciaQuimica || false,
    meioAmbiente: beneficiario.interesses?.meioAmbiente || false,
    documentacaoPessoal: beneficiario.interesses?.documentacaoPessoal || false,
    saudeGeral: beneficiario.interesses?.saudeGeral || false,
    empreendedorismo: beneficiario.interesses?.empreendedorismo || false,
    sustentabilidade: beneficiario.interesses?.sustentabilidade || false,
    // Cursos
    pinturaEmTecido: beneficiario.interesses?.pinturaEmTecido || false,
    bijuteria: beneficiario.interesses?.bijuteria || false,
    cestaria: beneficiario.interesses?.cestaria || false,
    costura: beneficiario.interesses?.costura || false,
    bordado: beneficiario.interesses?.bordado || false,
    croche: beneficiario.interesses?.croche || false,
    trico: beneficiario.interesses?.trico || false,
    teatro: beneficiario.interesses?.teatro || false,
    reciclagem: beneficiario.interesses?.reciclagem || false,
    informatica: beneficiario.interesses?.informatica || false,
    cursos: beneficiario.interesses?.cursos || false,
    alfabetizacao: beneficiario.interesses?.alfabetizacao || false,
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setInterestsData({
      // Palestras
      programasSociais: beneficiario.interesses?.programasSociais || false,
      violenciaDomestica: beneficiario.interesses?.violenciaDomestica || false,
      dependenciaQuimica: beneficiario.interesses?.dependenciaQuimica || false,
      meioAmbiente: beneficiario.interesses?.meioAmbiente || false,
      documentacaoPessoal: beneficiario.interesses?.documentacaoPessoal || false,
      saudeGeral: beneficiario.interesses?.saudeGeral || false,
      empreendedorismo: beneficiario.interesses?.empreendedorismo || false,
      sustentabilidade: beneficiario.interesses?.sustentabilidade || false,
      // Cursos
      pinturaEmTecido: beneficiario.interesses?.pinturaEmTecido || false,
      bijuteria: beneficiario.interesses?.bijuteria || false,
      cestaria: beneficiario.interesses?.cestaria || false,
      costura: beneficiario.interesses?.costura || false,
      bordado: beneficiario.interesses?.bordado || false,
      croche: beneficiario.interesses?.croche || false,
      trico: beneficiario.interesses?.trico || false,
      teatro: beneficiario.interesses?.teatro || false,
      reciclagem: beneficiario.interesses?.reciclagem || false,
      informatica: beneficiario.interesses?.informatica || false,
      cursos: beneficiario.interesses?.cursos || false,
      alfabetizacao: beneficiario.interesses?.alfabetizacao || false,
    });
  };

  const handleSave = async () => {
    const response = await atualizarInteresses({
      beneficiarioId: beneficiarioId,
      body: {
        ...interestsData,
      },
    });

    if (response?.success) {
      toast.success('Interesses atualizados com sucesso');
      onRefresh();
      setEditing(false);
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar interesses');
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

  const shouldShowInteresses = () => {
    return interestsData && Object.values(interestsData).some((value) => value === true);
  };

  const gridCols = isMobile ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <EditCard
      title="Interesses"
      isEditing={editing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!editing ? (
        shouldShowInteresses() ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Interesse em Palestras</h3>
              <div className={`grid ${gridCols} gap-4`}>
                {beneficiario.interesses?.programasSociais && (
                  <div className="space-y-1">
                    <span className="text-sm">Programas Sociais</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.violenciaDomestica && (
                  <div className="space-y-1">
                    <span className="text-sm">Violência Doméstica</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.dependenciaQuimica && (
                  <div className="space-y-1">
                    <span className="text-sm">Dependência Química</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.meioAmbiente && (
                  <div className="space-y-1">
                    <span className="text-sm">Meio Ambiente</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.documentacaoPessoal && (
                  <div className="space-y-1">
                    <span className="text-sm">Documentação Pessoal</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.saudeGeral && (
                  <div className="space-y-1">
                    <span className="text-sm">Saúde Geral</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.empreendedorismo && (
                  <div className="space-y-1">
                    <span className="text-sm">Empreendedorismo</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.sustentabilidade && (
                  <div className="space-y-1">
                    <span className="text-sm">Sustentabilidade</span>
                    {renderSwitchField(true)}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Interesse em Cursos</h3>
              <div className={`grid ${gridCols} gap-4`}>
                {beneficiario.interesses?.pinturaEmTecido && (
                  <div className="space-y-1">
                    <span className="text-sm">Pintura em Tecido</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.bijuteria && (
                  <div className="space-y-1">
                    <span className="text-sm">Bijuteria</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.cestaria && (
                  <div className="space-y-1">
                    <span className="text-sm">Cestaria</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.costura && (
                  <div className="space-y-1">
                    <span className="text-sm">Costura</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.bordado && (
                  <div className="space-y-1">
                    <span className="text-sm">Bordado</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.croche && (
                  <div className="space-y-1">
                    <span className="text-sm">Crochê</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.trico && (
                  <div className="space-y-1">
                    <span className="text-sm">Tricô</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.teatro && (
                  <div className="space-y-1">
                    <span className="text-sm">Teatro</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.reciclagem && (
                  <div className="space-y-1">
                    <span className="text-sm">Reciclagem</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.informatica && (
                  <div className="space-y-1">
                    <span className="text-sm">Informática</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.cursos && (
                  <div className="space-y-1">
                    <span className="text-sm">Outros Cursos</span>
                    {renderSwitchField(true)}
                  </div>
                )}
                {beneficiario.interesses?.alfabetizacao && (
                  <div className="space-y-1">
                    <span className="text-sm">Alfabetização</span>
                    {renderSwitchField(true)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum interesse cadastrado</p>
        )
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Interesse em Palestras</h3>
            <div className={`grid ${gridCols} gap-4`}>
              <div className="flex items-center space-x-2">
                <Switch
                  id="programasSociais"
                  checked={interestsData.programasSociais}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, programasSociais: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="programasSociais">Programas Sociais</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="violenciaDomestica"
                  checked={interestsData.violenciaDomestica}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, violenciaDomestica: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="violenciaDomestica">Violência Doméstica</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="dependenciaQuimica"
                  checked={interestsData.dependenciaQuimica}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, dependenciaQuimica: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="dependenciaQuimica">Dependência Química</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="meioAmbiente"
                  checked={interestsData.meioAmbiente}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, meioAmbiente: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="meioAmbiente">Meio Ambiente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="documentacaoPessoal"
                  checked={interestsData.documentacaoPessoal}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, documentacaoPessoal: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="documentacaoPessoal">Documentação Pessoal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="saudeGeral"
                  checked={interestsData.saudeGeral}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, saudeGeral: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="saudeGeral">Saúde Geral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="empreendedorismo"
                  checked={interestsData.empreendedorismo}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, empreendedorismo: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="empreendedorismo">Empreendedorismo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sustentabilidade"
                  checked={interestsData.sustentabilidade}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, sustentabilidade: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="sustentabilidade">Sustentabilidade</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Interesse em Cursos</h3>
            <div className={`grid ${gridCols} gap-4`}>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pinturaEmTecido"
                  checked={interestsData.pinturaEmTecido}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, pinturaEmTecido: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="pinturaEmTecido">Pintura em Tecido</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="bijuteria"
                  checked={interestsData.bijuteria}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, bijuteria: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="bijuteria">Bijuteria</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="cestaria"
                  checked={interestsData.cestaria}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, cestaria: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="cestaria">Cestaria</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="costura"
                  checked={interestsData.costura}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, costura: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="costura">Costura</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="bordado"
                  checked={interestsData.bordado}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, bordado: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="bordado">Bordado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="croche"
                  checked={interestsData.croche}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, croche: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="croche">Crochê</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="trico"
                  checked={interestsData.trico}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, trico: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="trico">Tricô</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="teatro"
                  checked={interestsData.teatro}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, teatro: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="teatro">Teatro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="reciclagem"
                  checked={interestsData.reciclagem}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, reciclagem: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="reciclagem">Reciclagem</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="informatica"
                  checked={interestsData.informatica}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, informatica: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="informatica">Informática</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="cursos"
                  checked={interestsData.cursos}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, cursos: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="cursos">Outros Cursos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="alfabetizacao"
                  checked={interestsData.alfabetizacao}
                  onCheckedChange={(checked) =>
                    setInterestsData({ ...interestsData, alfabetizacao: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="alfabetizacao">Alfabetização</Label>
              </div>
            </div>
          </div>
        </div>
      )}
    </EditCard>
  );
}
