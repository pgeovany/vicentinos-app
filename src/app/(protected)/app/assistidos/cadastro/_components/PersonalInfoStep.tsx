'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { Switch } from '@/components/ui/switch';
import { maskCPF, maskPhone, maskRG } from '@/lib/masks';
import { BeneficiarioFormData } from '../types';
import {
  ENUM_ESTADO_CIVIL_BENEFICIARIO,
  ENUM_SEXO_BENEFICIARIO,
} from '@/api/beneficiarios/schemas';

interface PersonalInfoStepProps {
  formData: BeneficiarioFormData;
  updateFormData: (data: Partial<BeneficiarioFormData>) => void;
}

export function PersonalInfoStep({ formData, updateFormData }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          Campos com <span className="text-destructive">*</span> são obrigatórios
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData({ nome: e.target.value })}
            placeholder="Nome completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexo">
            Sexo <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.sexo} onValueChange={(value) => updateFormData({ sexo: value })}>
            <SelectTrigger id="sexo">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ENUM_SEXO_BENEFICIARIO.MASCULINO}>Masculino</SelectItem>
              <SelectItem value={ENUM_SEXO_BENEFICIARIO.FEMININO}>Feminino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            value={formData.cpf}
            onChange={(e) => updateFormData({ cpf: maskCPF(e.target.value) })}
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            value={formData.rg}
            onChange={(e) => updateFormData({ rg: maskRG(e.target.value) })}
            placeholder="00.000.000-0"
            maxLength={12}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data-nascimento">Data de nascimento</Label>
          <CustomDatePicker
            id="data-nascimento"
            date={formData.dataNascimento ? new Date(formData.dataNascimento) : undefined}
            onSelect={(date) =>
              updateFormData({
                dataNascimento: date ? date.toISOString().split('T')[0] : '',
              })
            }
            fromYear={1920}
            toYear={new Date().getFullYear()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => updateFormData({ telefone: maskPhone(e.target.value) })}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estadoCivil">Estado Civil</Label>
          <Select
            value={formData.estadoCivil}
            onValueChange={(value) => updateFormData({ estadoCivil: value })}
          >
            <SelectTrigger id="estadoCivil">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ENUM_ESTADO_CIVIL_BENEFICIARIO.SOLTEIRO}>Solteiro(a)</SelectItem>
              <SelectItem value={ENUM_ESTADO_CIVIL_BENEFICIARIO.CASADO}>Casado(a)</SelectItem>
              <SelectItem value={ENUM_ESTADO_CIVIL_BENEFICIARIO.VIUVO}>Viúvo(a)</SelectItem>
              <SelectItem value={ENUM_ESTADO_CIVIL_BENEFICIARIO.DIVORCIADO}>
                Divorciado(a)
              </SelectItem>
              <SelectItem value={ENUM_ESTADO_CIVIL_BENEFICIARIO.UNIAO_ESTAVEL}>
                União Estável
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profissao">Profissão</Label>
          <Input
            id="profissao"
            value={formData.profissao || ''}
            onChange={(e) => updateFormData({ profissao: e.target.value })}
            placeholder="Profissão"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rendaMensal">Renda Mensal</Label>
          <Select
            value={formData.rendaMensal}
            onValueChange={(value) => updateFormData({ rendaMensal: value })}
          >
            <SelectTrigger id="rendaMensal">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'Sem renda'}>Sem renda</SelectItem>
              <SelectItem value={'Até 1 salário mínimo'}>Até 1 salário mínimo</SelectItem>
              <SelectItem value={'Até 2 salários mínimos'}>Até 2 salários mínimos</SelectItem>
              <SelectItem value={'Até 3 salários mínimos'}>Até 3 salários mínimos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between space-y-0 pt-4">
          <Label htmlFor="pessoaComDeficiencia">Pessoa com deficiência</Label>
          <Switch
            id="pessoaComDeficiencia"
            checked={formData.pessoaComDeficiencia}
            onCheckedChange={(checked) => updateFormData({ pessoaComDeficiencia: checked })}
          />
        </div>
      </div>
    </div>
  );
}
