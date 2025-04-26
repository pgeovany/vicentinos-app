'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { maskCEP } from '@/lib/masks';
import { BeneficiarioFormData } from '../types';

interface AddressStepProps {
  formData: BeneficiarioFormData;
  updateFormData: (data: Partial<BeneficiarioFormData>) => void;
}

export function AddressStep({ formData, updateFormData }: AddressStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>Todos os campos de endereço são opcionais.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rua">Rua</Label>
          <Input
            id="rua"
            value={formData.rua}
            onChange={(e) => updateFormData({ rua: e.target.value })}
            placeholder="Rua, Avenida, Estrada, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            value={formData.numero}
            onChange={(e) => updateFormData({ numero: e.target.value })}
            placeholder="Número"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            value={formData.complemento}
            onChange={(e) => updateFormData({ complemento: e.target.value })}
            placeholder="Apartamento, bloco, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro</Label>
          <Input
            id="bairro"
            value={formData.bairro}
            onChange={(e) => updateFormData({ bairro: e.target.value })}
            placeholder="Bairro"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            value={formData.cidade}
            onChange={(e) => updateFormData({ cidade: e.target.value })}
            placeholder="Cidade"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            value={formData.cep}
            onChange={(e) => updateFormData({ cep: maskCEP(e.target.value) })}
            placeholder="00000-000"
            maxLength={9}
          />
        </div>
      </div>
    </div>
  );
}
