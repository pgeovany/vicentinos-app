'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { criarBeneficiario, alterarStatusBeneficiario } from '../../actions';
import { renderOptionalField, renderOptionalDate } from '@/lib/render-optional-fields';
import { addCpfMask } from '@/lib/add-cpf-mask';
import { addPhoneMask } from '@/lib/add-phone-mask';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { ensureCorrectDate, toLocalIsoMidnight } from '@/lib/fix-date';
import { maskCPF, maskPhone, stripMask } from '@/lib/masks';
import { EditCard } from './EditCard';

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
    telefone: beneficiario.telefone || '',
    email: beneficiario.email || '',
    dataNascimento: ensureCorrectDate(beneficiario.dataNascimento),
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nome: beneficiario.nome || '',
      cpf: beneficiario.cpf || '',
      telefone: beneficiario.telefone || '',
      email: beneficiario.email || '',
      dataNascimento: ensureCorrectDate(beneficiario.dataNascimento),
    });
  };

  const handleSave = async () => {
    const response = await criarBeneficiario({
      beneficiarioId: beneficiarioId,
      nome: formData.nome,
      cpf: stripMask(formData.cpf) || undefined,
      dataNascimento: formData.dataNascimento
        ? toLocalIsoMidnight(formData.dataNascimento)
        : undefined,
      telefone: stripMask(formData.telefone) || undefined,
      email: formData.email || undefined,
    });

    if (response?.success) {
      toast.success('Dados pessoais atualizados com sucesso');
      onRefresh();
      setEditing(false);
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar dados pessoais');
    }
  };

  const toggleStatus = async () => {
    const newStatus = beneficiario.status.toLowerCase() === 'ativo' ? 'INATIVO' : 'ATIVO';

    const response = await alterarStatusBeneficiario({
      beneficiarioId,
    });

    if (response?.success) {
      toast.success(`Beneficiário ${newStatus.toLowerCase()}`);
      onRefresh();
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar status');
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
          {renderOptionalField(addCpfMask(beneficiario.cpf ?? ''), 'CPF')}
          {renderOptionalDate(beneficiario.dataNascimento, 'Data de Nascimento')}
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Status</span>
            <div className="flex items-center space-x-2">
              <Switch
                className="cursor-pointer"
                checked={beneficiario.status?.toLowerCase() === 'ativo'}
                onCheckedChange={toggleStatus}
              />
              <Label>{beneficiario.status?.toLowerCase()}</Label>
            </div>
          </div>
          {renderOptionalField(addPhoneMask(beneficiario.telefone ?? ''), 'Telefone')}
          {renderOptionalField(beneficiario.email, 'Email')}
          {renderOptionalDate(beneficiario.criadoEm, 'Cadastrado em')}
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
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </EditCard>
  );
}
