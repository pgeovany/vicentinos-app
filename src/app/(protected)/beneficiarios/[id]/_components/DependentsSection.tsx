'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { adicionarDependentes, removerDependente } from '../../actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
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

const PARENTESCO_OPTIONS = [
  { value: 'Pai/Mãe', label: 'Pai/Mãe' },
  { value: 'Avô/Avó', label: 'Avô/Avó' },
  { value: 'Cônjuge', label: 'Cônjuge' },
  { value: 'Filho(a)', label: 'Filho(a)' },
  { value: 'Outro', label: 'Outro' },
];

interface DependentFormData {
  id?: string;
  nome: string;
  dataNascimento: string;
  parentesco: string;
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
  const [newDependent, setNewDependent] = useState<DependentFormData>({
    nome: '',
    dataNascimento: '',
    parentesco: '',
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setNewDependent({
      nome: '',
      dataNascimento: '',
      parentesco: '',
    });
  };

  const handleAddDependent = async () => {
    if (!newDependent.nome.trim()) {
      toast.error('Nome do dependente é obrigatório');
      return;
    }

    if (!newDependent.dataNascimento) {
      toast.error('Data de nascimento do dependente é obrigatória');
      return;
    }

    if (!newDependent.parentesco.trim()) {
      toast.error('Parentesco do dependente é obrigatório');
      return;
    }

    const dateObj = new Date(newDependent.dataNascimento);
    if (isNaN(dateObj.getTime())) {
      toast.error(`Data de nascimento inválida`);
      return;
    }

    const dependentsToSend = [
      {
        nome: newDependent.nome.trim(),
        parentesco: newDependent.parentesco.trim(),
        dataNascimento: dateObj,
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
      resetForm();
      onRefresh();
    } else {
      toast.error(response?.error ?? 'Erro ao adicionar dependente');
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
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <p>Parentesco: {dependente.parentesco}</p>
                      <p>
                        Idade: {getAge(dependente.dataNascimento)} anos - (
                        {formatDate(dependente.dataNascimento)})
                      </p>
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
          {/* List of existing dependents with delete buttons */}
          {beneficiario.dependentes.length > 0 ? (
            <div className="space-y-4">
              {beneficiario.dependentes.map((dependente) => (
                <div
                  key={dependente.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{dependente.nome}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <p>Parentesco: {dependente.parentesco}</p>
                      <p>
                        Data de Nascimento:{' '}
                        {new Date(dependente.dataNascimento).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => handleRemoveDependent(dependente.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mb-4">Nenhum dependente cadastrado</p>
          )}

          {/* Form to add a new dependent */}
          <div className="p-4 border rounded-md border-dashed">
            <h4 className="font-medium mb-4">Adicionar Dependente</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-dep-nome">Nome *</Label>
                <Input
                  id="new-dep-nome"
                  value={newDependent.nome}
                  onChange={(e) => setNewDependent({ ...newDependent, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-dep-parentesco">Parentesco *</Label>
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
                <Label htmlFor="new-dep-data">Data de Nascimento *</Label>
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
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddDependent} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Dependente
              </Button>
            </div>
          </div>
        </div>
      )}
    </EditCard>
  );
}
