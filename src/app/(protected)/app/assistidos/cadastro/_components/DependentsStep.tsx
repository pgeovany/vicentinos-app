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
import { formatDate } from '@/lib/format-date';
import { maskCPF, maskRG } from '@/lib/masks';
import { Textarea } from '@/components/ui/textarea';
import { ENUM_SEXO_BENEFICIARIO } from '@/api/beneficiarios/schemas';
import { Separator } from '@/components/ui/separator';

interface DependentsStepProps {
  dependentes: DependentFormData[];
  updateDependentes: (dependentes: DependentFormData[]) => void;
}

export function DependentsStep({ dependentes, updateDependentes }: DependentsStepProps) {
  const [newDependent, setNewDependent] = useState<DependentFormData>({
    nome: '',
    dataNascimento: '',
    parentesco: '',
    sexo: '',
    cpf: '',
    rg: '',
    certidaoNascimento: '',
    escolaridade: '',
    telefone: '',
    email: '',
    rendaMensal: '',
    trabalho: '',
    observacao: '',
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

    if (!newDependent.sexo.trim()) {
      toast.error('Sexo do dependente é obrigatório');
      return;
    }

    updateDependentes([...dependentes, { ...newDependent }]);

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
              key={`${dependente.nome}-${dependente.dataNascimento}`}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <p className="font-medium">{dependente.nome}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                  <p>Parentesco: {dependente.parentesco}</p>
                  <p>
                    Sexo:{' '}
                    {dependente.sexo === ENUM_SEXO_BENEFICIARIO.MASCULINO
                      ? 'Masculino'
                      : 'Feminino'}
                  </p>
                  <p>Data de Nascimento: {formatDate(dependente.dataNascimento)}</p>
                  {dependente.cpf && <p>CPF: {dependente.cpf}</p>}
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

        <div className="space-y-6">
          <div className="space-y-4">
            <h5 className="font-medium">Dados Pessoais</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="new-dep-sexo">
                  Sexo <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newDependent.sexo}
                  onValueChange={(value) => setNewDependent((prev) => ({ ...prev, sexo: value }))}
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
                  onValueChange={(value) =>
                    setNewDependent((prev) => ({ ...prev, parentesco: value }))
                  }
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

              <div className="space-y-2">
                <Label htmlFor="new-dep-cpf">CPF</Label>
                <Input
                  id="new-dep-cpf"
                  value={newDependent.cpf || ''}
                  onChange={(e) =>
                    setNewDependent((prev) => ({ ...prev, cpf: maskCPF(e.target.value) }))
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
                  onChange={(e) =>
                    setNewDependent((prev) => ({ ...prev, rg: maskRG(e.target.value) }))
                  }
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
                    setNewDependent((prev) => ({ ...prev, certidaoNascimento: e.target.value }))
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
                    setNewDependent((prev) => ({ ...prev, escolaridade: e.target.value }))
                  }
                  placeholder="Ex: Ensino Fundamental"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h5 className="font-medium">Informações Adicionais</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  onChange={(e) =>
                    setNewDependent((prev) => ({ ...prev, trabalho: e.target.value }))
                  }
                  placeholder="Ex: Estudante"
                />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="new-dep-observacao">Observações</Label>
                <Textarea
                  id="new-dep-observacao"
                  value={newDependent.observacao || ''}
                  onChange={(e) =>
                    setNewDependent((prev) => ({ ...prev, observacao: e.target.value }))
                  }
                  placeholder="Observações adicionais"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleAddDependent} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Dependente
          </Button>
        </div>
      </div>
    </div>
  );
}
