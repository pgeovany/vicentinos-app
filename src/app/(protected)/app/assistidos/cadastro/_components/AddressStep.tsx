'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { maskCEP } from '@/lib/masks';
import { BeneficiarioFormData } from '../types';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateQuantityOptions } from '@/lib/generate-select-quantity';

interface AddressStepProps {
  formData: BeneficiarioFormData;
  updateFormData: (data: Partial<BeneficiarioFormData>) => void;
}

export function AddressStep({ formData, updateFormData }: AddressStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>Preencha as informações de moradia do assistido.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Endereço</h3>
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

            <div className="space-y-2">
              <Label htmlFor="pontoReferencia">Ponto de Referência</Label>
              <Input
                id="pontoReferencia"
                value={formData.pontoReferencia || ''}
                onChange={(e) => updateFormData({ pontoReferencia: e.target.value })}
                placeholder="Próximo a..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroComodos">Número de Cômodos</Label>
              <Select
                value={formData.numeroComodos.toString()}
                onValueChange={(value) => updateFormData({ numeroComodos: parseInt(value) })}
              >
                <SelectTrigger id="numeroComodos" className="w-full">
                  <SelectValue placeholder="Selecione a quantidade" />
                </SelectTrigger>
                <SelectContent>
                  {generateQuantityOptions(10).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tipo de Residência</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="proprio">Próprio</Label>
              <Switch
                id="proprio"
                checked={formData.proprio}
                onCheckedChange={(checked) => updateFormData({ proprio: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="financiado">Financiado</Label>
              <Switch
                id="financiado"
                checked={formData.financiado}
                onCheckedChange={(checked) => updateFormData({ financiado: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="alugado">Alugado</Label>
              <Switch
                id="alugado"
                checked={formData.alugado}
                onCheckedChange={(checked) => updateFormData({ alugado: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="cedido">Cedido</Label>
              <Switch
                id="cedido"
                checked={formData.cedido}
                onCheckedChange={(checked) => updateFormData({ cedido: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="heranca">Herança</Label>
              <Switch
                id="heranca"
                checked={formData.heranca}
                onCheckedChange={(checked) => updateFormData({ heranca: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="programaSocial">Programa Social</Label>
              <Switch
                id="programaSocial"
                checked={formData.programaSocial}
                onCheckedChange={(checked) => updateFormData({ programaSocial: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ocupacao">Ocupação</Label>
              <Switch
                id="ocupacao"
                checked={formData.ocupacao}
                onCheckedChange={(checked) => updateFormData({ ocupacao: checked })}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Infraestrutura</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="banheiro">Banheiro</Label>
              <Switch
                id="banheiro"
                checked={formData.banheiro}
                onCheckedChange={(checked) => updateFormData({ banheiro: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="aguaEncanada">Água Encanada</Label>
              <Switch
                id="aguaEncanada"
                checked={formData.aguaEncanada}
                onCheckedChange={(checked) => updateFormData({ aguaEncanada: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="energiaEletrica">Energia Elétrica</Label>
              <Switch
                id="energiaEletrica"
                checked={formData.energiaEletrica}
                onCheckedChange={(checked) => updateFormData({ energiaEletrica: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="esgoto">Esgoto</Label>
              <Switch
                id="esgoto"
                checked={formData.esgoto}
                onCheckedChange={(checked) => updateFormData({ esgoto: checked })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
