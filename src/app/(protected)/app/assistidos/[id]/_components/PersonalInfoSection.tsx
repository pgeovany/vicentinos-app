'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { criarBeneficiario } from '../../actions';
import { renderOptionalField, renderOptionalDate } from '@/lib/render-optional-fields';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { ensureCorrectDate, toLocalIsoMidnight } from '@/lib/fix-date';
import { maskCPF, maskPhone, maskRG, stripMask } from '@/lib/masks';
import { EditCard } from './EditCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ENUM_ESTADO_CIVIL_BENEFICIARIO,
  ENUM_SEXO_BENEFICIARIO,
} from '@/api/beneficiarios/schemas';
import { ESTADO_CIVIL_MAP } from '@/lib/estado-civil.map';

interface PersonalInfoSectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => void;
}

export function PersonalInfoSection({
  beneficiario,
  beneficiarioId,
  onRefresh,
}: PersonalInfoSectionProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: beneficiario.nome || '',
    cpf: beneficiario.cpf || '',
    rg: beneficiario.rg || '',
    telefone: beneficiario.telefone || '',
    sexo: beneficiario.sexo || '',
    estadoCivil: beneficiario.estadoCivil || '',
    profissao: beneficiario.profissao || '',
    rendaMensal: beneficiario.rendaMensal || '',
    pessoaComDeficiencia: beneficiario.pessoaComDeficiencia || false,
    dataNascimento: ensureCorrectDate(beneficiario.dataNascimento ?? ''),
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nome: beneficiario.nome || '',
      cpf: beneficiario.cpf || '',
      rg: beneficiario.rg || '',
      telefone: beneficiario.telefone || '',
      sexo: beneficiario.sexo || '',
      estadoCivil: beneficiario.estadoCivil || '',
      profissao: beneficiario.profissao || '',
      rendaMensal: beneficiario.rendaMensal || '',
      pessoaComDeficiencia: beneficiario.pessoaComDeficiencia || false,
      dataNascimento: ensureCorrectDate(beneficiario.dataNascimento ?? ''),
    });
  };

  const handleSave = async () => {
    const response = await criarBeneficiario({
      beneficiarioId: beneficiarioId,
      nome: formData.nome,
      cpf: stripMask(formData.cpf) || undefined,
      rg: stripMask(formData.rg) || undefined,
      sexo: (formData.sexo as ENUM_SEXO_BENEFICIARIO) || undefined,
      estadoCivil: (formData.estadoCivil as ENUM_ESTADO_CIVIL_BENEFICIARIO) || undefined,
      profissao: formData.profissao || undefined,
      rendaMensal: formData.rendaMensal || undefined,
      pessoaComDeficiencia: formData.pessoaComDeficiencia,
      dataNascimento: formData.dataNascimento
        ? toLocalIsoMidnight(formData.dataNascimento)
        : undefined,
      telefone: stripMask(formData.telefone) || undefined,
    });

    if (response?.success) {
      toast.success('Dados pessoais atualizados com sucesso');
      onRefresh();
      setEditing(false);
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar dados pessoais');
    }
  };

  return (
    <EditCard
      title="Informações Pessoais"
      isEditing={editing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!editing ? (
        <div className="grid grid-cols-2 gap-4">
          {renderOptionalField(beneficiario.nome, 'Nome')}
          {renderOptionalField(maskCPF(beneficiario.cpf ?? ''), 'CPF')}
          {renderOptionalField(maskRG(beneficiario.rg ?? ''), 'RG')}
          {renderOptionalDate(beneficiario.dataNascimento, 'Data de Nascimento')}
          {renderOptionalField(beneficiario.sexo, 'Sexo')}
          {renderOptionalField(
            ESTADO_CIVIL_MAP[beneficiario.estadoCivil as ENUM_ESTADO_CIVIL_BENEFICIARIO] ?? '',
            'Estado Civil',
          )}
          {renderOptionalField(beneficiario.profissao, 'Profissão')}
          {renderOptionalField(beneficiario.rendaMensal, 'Renda Mensal')}
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Pessoa com Deficiência</span>
            <div className="flex items-center space-x-2">
              <Switch
                className="cursor-pointer"
                checked={beneficiario.pessoaComDeficiencia}
                disabled
              />
              <Label>{beneficiario.pessoaComDeficiencia ? 'Sim' : 'Não'}</Label>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Status</span>
            <div className="flex items-center space-x-2">
              <Label>{beneficiario.status?.toLowerCase()}</Label>
            </div>
          </div>
          {renderOptionalField(maskPhone(beneficiario.telefone ?? ''), 'Telefone')}
          {renderOptionalField(beneficiario.tipoCesta?.nome, 'Tipo de Cesta')}
          {renderOptionalDate(beneficiario.criadoEm, 'Cadastrado em')}
          {renderOptionalDate(beneficiario.atualizadoEm, 'Última atualização')}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                maxLength={14}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => setFormData({ ...formData, rg: maskRG(e.target.value) })}
                maxLength={12}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-nascimento">Data de nascimento</Label>
              <CustomDatePicker
                id="data-nascimento"
                date={formData.dataNascimento ? new Date(formData.dataNascimento) : undefined}
                onSelect={(date) =>
                  setFormData({
                    ...formData,
                    dataNascimento: date ? date.toISOString().split('T')[0] : '',
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={formData.sexo}
                onValueChange={(value) => setFormData({ ...formData, sexo: value })}
              >
                <SelectTrigger id="sexo" className="cursor-pointer">
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select
                value={formData.estadoCivil}
                onValueChange={(value) => setFormData({ ...formData, estadoCivil: value })}
              >
                <SelectTrigger id="estadoCivil" className="cursor-pointer">
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                  <SelectItem value="CASADO">Casado(a)</SelectItem>
                  <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                  <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                  <SelectItem value="SEPARADO">Separado(a)</SelectItem>
                  <SelectItem value="UNIAO_ESTAVEL">União Estável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={formData.profissao}
                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rendaMensal">Renda Mensal</Label>
              <Input
                id="rendaMensal"
                value={formData.rendaMensal}
                onChange={(e) => setFormData({ ...formData, rendaMensal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pessoaComDeficiencia">Pessoa com Deficiência</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="pessoaComDeficiencia"
                  checked={formData.pessoaComDeficiencia}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, pessoaComDeficiencia: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="pessoaComDeficiencia">
                  {formData.pessoaComDeficiencia ? 'Sim' : 'Não'}
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
                maxLength={15}
              />
            </div>
          </div>
        </div>
      )}
    </EditCard>
  );
}
