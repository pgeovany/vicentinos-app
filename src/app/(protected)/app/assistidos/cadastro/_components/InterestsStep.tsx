'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BeneficiarioFormData } from '../types';
import { Separator } from '@/components/ui/separator';

interface InterestsStepProps {
  formData: BeneficiarioFormData;
  updateFormData: (data: Partial<BeneficiarioFormData>) => void;
}

export function InterestsStep({ formData, updateFormData }: InterestsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>Marque os interesses do assistido em palestras e cursos.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Interesse em Palestras</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="programasSociais">Programas Sociais</Label>
              <Switch
                id="programasSociais"
                checked={formData.programasSociais || false}
                onCheckedChange={(checked) => updateFormData({ programasSociais: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="violenciaDomestica">Violência Doméstica</Label>
              <Switch
                id="violenciaDomestica"
                checked={formData.violenciaDomestica || false}
                onCheckedChange={(checked) => updateFormData({ violenciaDomestica: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dependenciaQuimica">Dependência Química</Label>
              <Switch
                id="dependenciaQuimica"
                checked={formData.dependenciaQuimica || false}
                onCheckedChange={(checked) => updateFormData({ dependenciaQuimica: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="meioAmbiente">Meio Ambiente</Label>
              <Switch
                id="meioAmbiente"
                checked={formData.meioAmbiente || false}
                onCheckedChange={(checked) => updateFormData({ meioAmbiente: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="documentacaoPessoal">Documentação Pessoal</Label>
              <Switch
                id="documentacaoPessoal"
                checked={formData.documentacaoPessoal || false}
                onCheckedChange={(checked) => updateFormData({ documentacaoPessoal: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="saudeGeral">Saúde Geral</Label>
              <Switch
                id="saudeGeral"
                checked={formData.saudeGeral || false}
                onCheckedChange={(checked) => updateFormData({ saudeGeral: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="empreendedorismo">Empreendedorismo</Label>
              <Switch
                id="empreendedorismo"
                checked={formData.empreendedorismo || false}
                onCheckedChange={(checked) => updateFormData({ empreendedorismo: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sustentabilidade">Sustentabilidade</Label>
              <Switch
                id="sustentabilidade"
                checked={formData.sustentabilidade || false}
                onCheckedChange={(checked) => updateFormData({ sustentabilidade: checked })}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Interesse em Cursos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="pinturaEmTecido">Pintura em Tecido</Label>
              <Switch
                id="pinturaEmTecido"
                checked={formData.pinturaEmTecido || false}
                onCheckedChange={(checked) => updateFormData({ pinturaEmTecido: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="bijuteria">Bijuteria</Label>
              <Switch
                id="bijuteria"
                checked={formData.bijuteria || false}
                onCheckedChange={(checked) => updateFormData({ bijuteria: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="cestaria">Cestaria</Label>
              <Switch
                id="cestaria"
                checked={formData.cestaria || false}
                onCheckedChange={(checked) => updateFormData({ cestaria: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="costura">Costura</Label>
              <Switch
                id="costura"
                checked={formData.costura || false}
                onCheckedChange={(checked) => updateFormData({ costura: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="bordado">Bordado</Label>
              <Switch
                id="bordado"
                checked={formData.bordado || false}
                onCheckedChange={(checked) => updateFormData({ bordado: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="croche">Crochê</Label>
              <Switch
                id="croche"
                checked={formData.croche || false}
                onCheckedChange={(checked) => updateFormData({ croche: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="trico">Tricô</Label>
              <Switch
                id="trico"
                checked={formData.trico || false}
                onCheckedChange={(checked) => updateFormData({ trico: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="teatro">Teatro</Label>
              <Switch
                id="teatro"
                checked={formData.teatro || false}
                onCheckedChange={(checked) => updateFormData({ teatro: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reciclagem">Reciclagem</Label>
              <Switch
                id="reciclagem"
                checked={formData.reciclagem || false}
                onCheckedChange={(checked) => updateFormData({ reciclagem: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="informatica">Informática</Label>
              <Switch
                id="informatica"
                checked={formData.informatica || false}
                onCheckedChange={(checked) => updateFormData({ informatica: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="cursos">Outros Cursos</Label>
              <Switch
                id="cursos"
                checked={formData.cursos || false}
                onCheckedChange={(checked) => updateFormData({ cursos: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="alfabetizacao">Alfabetização</Label>
              <Switch
                id="alfabetizacao"
                checked={formData.alfabetizacao || false}
                onCheckedChange={(checked) => updateFormData({ alfabetizacao: checked })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
