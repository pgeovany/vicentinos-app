'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { toast } from 'sonner';
import { DependentFormData } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PARENTESCO_OPTIONS } from '@/lib/parentesco-options';

interface DependentsStepProps {
  dependentes: DependentFormData[];
  updateDependentes: (dependentes: DependentFormData[]) => void;
}

export function DependentsStep({ dependentes, updateDependentes }: DependentsStepProps) {
  const [newDependent, setNewDependent] = useState<DependentFormData>({
    nome: '',
    dataNascimento: '',
    parentesco: '',
  });

  const handleAddDependent = () => {
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

    updateDependentes([...dependentes, { ...newDependent }]);

    setNewDependent({
      nome: '',
      dataNascimento: '',
      parentesco: '',
    });
  };

  const handleRemoveDependent = (index: number) => {
    const newDependentes = [...dependentes];
    newDependentes.splice(index, 1);
    updateDependentes(newDependentes);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>O cadastro de dependentes é opcional.</p>
      </div>
      {/* List of existing dependents */}
      {dependentes.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Dependentes cadastrados</h3>
          {dependentes.map((dependente, index) => (
            <div
              key={dependente.nome}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <p className="font-medium">{dependente.nome}</p>
                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                  <p>Parentesco: {dependente.parentesco}</p>
                  <p>
                    Data de Nascimento: {new Date(dependente.dataNascimento).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => handleRemoveDependent(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground py-4">Nenhum dependente cadastrado ainda.</div>
      )}

      {/* Form to add a new dependent */}
      <div className="p-4 border rounded-md border-dashed">
        <h4 className="font-medium mb-4">Adicionar novo dependente</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-dep-nome">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="new-dep-nome"
              value={newDependent.nome}
              onChange={(e) => setNewDependent((prev) => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-dep-parentesco">
              Parentesco <span className="text-destructive">*</span>
            </Label>
            <Select
              value={newDependent.parentesco}
              onValueChange={(value) => setNewDependent((prev) => ({ ...prev, parentesco: value }))}
            >
              <SelectTrigger id="new-dep-parentesco">
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
              date={newDependent.dataNascimento ? new Date(newDependent.dataNascimento) : undefined}
              onSelect={(date) =>
                setNewDependent((prev) => ({
                  ...prev,
                  dataNascimento: date ? date.toISOString().split('T')[0] : '',
                }))
              }
              fromYear={1920}
              toYear={new Date().getFullYear()}
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
  );
}
