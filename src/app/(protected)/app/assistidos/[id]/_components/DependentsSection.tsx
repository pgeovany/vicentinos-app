'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  BeneficiarioComHistoricoResponse,
  DependenteBeneficiario,
} from '@/api/beneficiarios/types';
import { adicionarDependentes, editarDependente, removerDependente } from '../../actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { EditCard } from './EditCard';
import { getAge } from '@/lib/get-age';
import { formatDate } from '@/lib/format-date';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PARENTESCO_OPTIONS } from '@/lib/parentesco-options';
import { maskCPF, maskRG } from '@/lib/masks';
import { Textarea } from '@/components/ui/textarea';
import { ENUM_SEXO_BENEFICIARIO } from '@/api/beneficiarios/schemas';
import { Separator } from '@/components/ui/separator';
import { ensureCorrectDate } from '@/lib/fix-date';

interface DependentFormData {
  id?: string;
  nome: string;
  dataNascimento: string;
  parentesco: string;
  sexo: string;
  cpf?: string;
  rg?: string;
  certidaoNascimento?: string;
  escolaridade?: string;
  rendaMensal?: string;
  trabalho?: string;
  observacao?: string;
}

interface DependentsSectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => void;
}

export function DependentsSection({
  beneficiario,
  beneficiarioId,
  onRefresh,
}: DependentsSectionProps) {
  const [editing, setEditing] = useState(false);
  const [editingDependentId, setEditingDependentId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDependent, setNewDependent] = useState<DependentFormData>({
    nome: '',
    dataNascimento: '',
    parentesco: '',
    sexo: '',
    cpf: '',
    rg: '',
    certidaoNascimento: '',
    escolaridade: '',
    rendaMensal: '',
    trabalho: '',
    observacao: '',
  });

  const handleEdit = () => {
    setEditing(true);
    setShowAddForm(beneficiario.dependentes.length === 0);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditingDependentId(null);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setNewDependent({
      nome: '',
      dataNascimento: '',
      parentesco: '',
      sexo: '',
      cpf: '',
      rg: '',
      certidaoNascimento: '',
      escolaridade: '',
      rendaMensal: '',
      trabalho: '',
      observacao: '',
    });
  };

  const startEditingDependent = (dependent: DependenteBeneficiario) => {
    setEditingDependentId(dependent.id);
    setShowAddForm(false);
    setNewDependent({
      id: dependent.id,
      nome: dependent.nome,
      dataNascimento: dependent.dataNascimento ? ensureCorrectDate(dependent.dataNascimento) : '',
      parentesco: dependent.parentesco,
      sexo: dependent.sexo,
      cpf: dependent.cpf || '',
      rg: dependent.rg || '',
      certidaoNascimento: dependent.certidaoNascimento || '',
      escolaridade: dependent.escolaridade || '',
      rendaMensal: dependent.rendaMensal || '',
      trabalho: dependent.trabalho || '',
      observacao: dependent.observacao || '',
    });
  };

  const cancelEditingDependent = () => {
    setEditingDependentId(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleShowAddForm = () => {
    resetForm();
    setEditingDependentId(null);
    setShowAddForm(true);
  };

  const handleCancelAddForm = () => {
    setShowAddForm(false);
    resetForm();
  };

  const validateDependentData = () => {
    if (!newDependent.nome.trim()) {
      toast.error('Nome do dependente é obrigatório');
      return false;
    }

    if (!newDependent.dataNascimento) {
      toast.error('Data de nascimento do dependente é obrigatória');
      return false;
    }

    if (!newDependent.parentesco.trim()) {
      toast.error('Parentesco do dependente é obrigatório');
      return false;
    }

    if (!newDependent.sexo) {
      toast.error('Sexo do dependente é obrigatório');
      return false;
    }

    const dateObj = new Date(newDependent.dataNascimento);
    if (isNaN(dateObj.getTime())) {
      toast.error(`Data de nascimento inválida`);
      return false;
    }

    return true;
  };

  const handleAddDependent = async () => {
    if (!validateDependentData()) return;

    const dateObj = new Date(newDependent.dataNascimento);

    const dependentsToSend = [
      {
        nome: newDependent.nome.trim(),
        parentesco: newDependent.parentesco.trim(),
        dataNascimento: dateObj,
        sexo: newDependent.sexo as ENUM_SEXO_BENEFICIARIO,
        cpf: newDependent.cpf?.trim() || null,
        rg: newDependent.rg?.trim() || null,
        certidaoNascimento: newDependent.certidaoNascimento?.trim() || null,
        escolaridade: newDependent.escolaridade?.trim() || null,
        rendaMensal: newDependent.rendaMensal?.trim() || null,
        trabalho: newDependent.trabalho?.trim() || null,
        observacao: newDependent.observacao?.trim() || null,
      },
    ];

    const response = await adicionarDependentes({
      beneficiarioId: beneficiarioId,
      body: {
        dependentes: dependentsToSend,
      },
    });

    if (response?.success) {
      toast.success('Dependente adicionado com sucesso');
      setShowAddForm(false);
      resetForm();
      onRefresh();
    } else {
      toast.error(response?.error ?? 'Erro ao adicionar dependente');
    }
  };

  const handleUpdateDependent = async () => {
    if (!validateDependentData() || !editingDependentId) return;

    const dateObj = new Date(newDependent.dataNascimento);

    const response = await editarDependente({
      beneficiarioId: beneficiarioId,
      dependenteId: editingDependentId,
      body: {
        nome: newDependent.nome.trim(),
        parentesco: newDependent.parentesco.trim(),
        dataNascimento: dateObj,
        sexo: newDependent.sexo as ENUM_SEXO_BENEFICIARIO,
        cpf: newDependent.cpf?.trim() || null,
        rg: newDependent.rg?.trim() || null,
        certidaoNascimento: newDependent.certidaoNascimento?.trim() || null,
        escolaridade: newDependent.escolaridade?.trim() || null,
        rendaMensal: newDependent.rendaMensal?.trim() || null,
        trabalho: newDependent.trabalho?.trim() || null,
        observacao: newDependent.observacao?.trim() || null,
      },
    });

    if (response?.success) {
      toast.success('Dependente atualizado com sucesso');
      setEditingDependentId(null);
      resetForm();
      onRefresh();
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar dependente');
    }
  };

  const handleRemoveDependent = async (dependentId: string) => {
    const response = await removerDependente({
      beneficiarioId: beneficiarioId,
      dependenteId: dependentId,
    });

    if (response?.success) {
      toast.success('Dependente removido com sucesso');
      onRefresh();
    } else {
      toast.error(response?.error ?? 'Erro ao remover dependente');
    }
  };

  // Render the dependent form (for both adding and editing)
  const renderDependentForm = () => {
    const isEditing = !!editingDependentId;
    return (
      <div className="p-4 border rounded-md border-dashed">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">
            {isEditing ? 'Editar Dependente' : 'Adicionar Dependente'}
          </h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={isEditing ? cancelEditingDependent : handleCancelAddForm}
            className="cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h5 className="font-medium">Dados Pessoais</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-dep-nome">
                  Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="new-dep-nome"
                  value={newDependent.nome}
                  onChange={(e) => setNewDependent({ ...newDependent, nome: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-dep-sexo">
                  Sexo <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newDependent.sexo}
                  onValueChange={(value) => setNewDependent({ ...newDependent, sexo: value })}
                >
                  <SelectTrigger id="new-dep-sexo" className="cursor-pointer">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ENUM_SEXO_BENEFICIARIO.MASCULINO}>Masculino</SelectItem>
                    <SelectItem value={ENUM_SEXO_BENEFICIARIO.FEMININO}>Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-dep-parentesco">
                  Parentesco <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newDependent.parentesco}
                  onValueChange={(value) => setNewDependent({ ...newDependent, parentesco: value })}
                >
                  <SelectTrigger id="new-dep-parentesco" className="cursor-pointer">
                    <SelectValue placeholder="Selecione o parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARENTESCO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-dep-data">
                  Data de Nascimento <span className="text-destructive">*</span>
                </Label>
                <CustomDatePicker
                  id="new-dep-data"
                  date={
                    newDependent.dataNascimento ? new Date(newDependent.dataNascimento) : undefined
                  }
                  onSelect={(date) =>
                    setNewDependent({
                      ...newDependent,
                      dataNascimento: date ? date.toISOString().split('T')[0] : '',
                    })
                  }
                  fromYear={1920}
                  toYear={new Date().getFullYear()}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-dep-cpf">CPF</Label>
                <Input
                  id="new-dep-cpf"
                  value={newDependent.cpf || ''}
                  onChange={(e) =>
                    setNewDependent({ ...newDependent, cpf: maskCPF(e.target.value) })
                  }
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-dep-rg">RG</Label>
                <Input
                  id="new-dep-rg"
                  value={newDependent.rg || ''}
                  onChange={(e) => setNewDependent({ ...newDependent, rg: maskRG(e.target.value) })}
                  placeholder="00.000.000-0"
                  maxLength={12}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-dep-certidao">Certidão de Nascimento</Label>
                <Input
                  id="new-dep-certidao"
                  value={newDependent.certidaoNascimento || ''}
                  onChange={(e) =>
                    setNewDependent({ ...newDependent, certidaoNascimento: e.target.value })
                  }
                  placeholder="Número da certidão"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-dep-escolaridade">Escolaridade</Label>
                <Input
                  id="new-dep-escolaridade"
                  value={newDependent.escolaridade || ''}
                  onChange={(e) =>
                    setNewDependent({ ...newDependent, escolaridade: e.target.value })
                  }
                  placeholder="Ex: Ensino Fundamental"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h5 className="font-medium">Informações Adicionais</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rendaMensal">
                  Renda Mensal <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newDependent.rendaMensal}
                  onValueChange={(value) =>
                    setNewDependent((prev) => ({ ...prev, rendaMensal: value }))
                  }
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

              <div className="space-y-2">
                <Label htmlFor="new-dep-trabalho">Trabalho/Ocupação</Label>
                <Input
                  id="new-dep-trabalho"
                  value={newDependent.trabalho || ''}
                  onChange={(e) => setNewDependent({ ...newDependent, trabalho: e.target.value })}
                  placeholder="Ex: Estudante"
                />
              </div>

              <div className="space-y-2 col-span-1 sm:col-span-2">
                <Label htmlFor="new-dep-observacao">Observações</Label>
                <Textarea
                  id="new-dep-observacao"
                  value={newDependent.observacao || ''}
                  onChange={(e) => setNewDependent({ ...newDependent, observacao: e.target.value })}
                  placeholder="Observações adicionais"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={isEditing ? handleUpdateDependent : handleAddDependent}
            className="cursor-pointer"
          >
            {isEditing ? (
              'Salvar Alterações'
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Dependente
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <EditCard
      title="Dependentes"
      isEditing={editing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={() => setEditing(false)}
    >
      {!editing ? (
        (() => {
          if (beneficiario.dependentes.length > 0) {
            return (
              <div className="space-y-4">
                {beneficiario.dependentes.map((dependente) => (
                  <div key={dependente.id} className="space-y-1">
                    <p className="font-medium">{dependente.nome}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>Parentesco: {dependente.parentesco}</p>
                      <p>
                        Idade: {getAge(dependente.dataNascimento!)} anos - (
                        {formatDate(dependente.dataNascimento)})
                      </p>
                      <p>
                        Sexo:{' '}
                        {dependente.sexo === ENUM_SEXO_BENEFICIARIO.MASCULINO
                          ? 'Masculino'
                          : 'Feminino'}
                      </p>
                      {dependente.cpf && <p>CPF: {maskCPF(dependente.cpf)}</p>}
                      {dependente.rg && <p>RG: {maskRG(dependente.rg)}</p>}
                      {dependente.escolaridade && <p>Escolaridade: {dependente.escolaridade}</p>}
                      {dependente.rendaMensal && <p>Renda: {dependente.rendaMensal}</p>}
                      {dependente.certidaoNascimento && (
                        <p>Certidão nascimento: {dependente.certidaoNascimento}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          } else {
            return <p className="text-muted-foreground">Nenhum dependente cadastrado</p>;
          }
        })()
      ) : (
        <div className="space-y-6">
          {/* List of existing dependents with edit and delete buttons */}
          {beneficiario.dependentes.length > 0 && !editingDependentId && !showAddForm ? (
            <div className="space-y-4">
              {beneficiario.dependentes.map((dependente) => (
                <div
                  key={dependente.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{dependente.nome}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                      <p>Parentesco: {dependente.parentesco}</p>
                      <p>Data de Nascimento: {formatDate(dependente.dataNascimento)}</p>
                      <p>
                        Sexo:{' '}
                        {dependente.sexo === ENUM_SEXO_BENEFICIARIO.MASCULINO
                          ? 'Masculino'
                          : 'Feminino'}
                      </p>
                      {dependente.cpf && <p>CPF: {dependente.cpf}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => startEditingDependent(dependente)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleRemoveDependent(dependente.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {editingDependentId || showAddForm || beneficiario.dependentes.length === 0 ? (
            renderDependentForm()
          ) : (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleShowAddForm} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Novo Dependente
              </Button>
            </div>
          )}
        </div>
      )}
    </EditCard>
  );
}
