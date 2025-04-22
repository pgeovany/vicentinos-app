'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { maskCPF, maskPhone, maskRG } from '@/lib/masks';
import { BeneficiarioFormData } from '../types';

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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="email@exemplo.com"
          />
        </div>
      </div>
    </div>
  );
}
