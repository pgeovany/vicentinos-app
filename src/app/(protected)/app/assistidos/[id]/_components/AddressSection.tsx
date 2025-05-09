'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { atualizarEndereco } from '../../actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { maskCEP, stripMask } from '@/lib/masks';
import { EditCard } from './EditCard';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateQuantityOptions } from '@/lib/generate-select-quantity';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddressSectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => void;
}

export function AddressSection({ beneficiario, beneficiarioId, onRefresh }: AddressSectionProps) {
  const isMobile = useIsMobile();
  const [editing, setEditing] = useState(false);
  const [addressData, setAddressData] = useState({
    rua: beneficiario.endereco?.rua || '',
    numero: beneficiario.endereco?.numero || '',
    bairro: beneficiario.endereco?.bairro || '',
    cidade: beneficiario.endereco?.cidade || '',
    cep: beneficiario.endereco?.cep || '',
    complemento: beneficiario.endereco?.complemento || '',
    pontoReferencia: beneficiario.endereco?.pontoReferencia || '',
    numeroComodos: beneficiario.endereco?.numeroComodos || 0,
    proprio: beneficiario.endereco?.proprio || false,
    financiado: beneficiario.endereco?.financiado || false,
    alugado: beneficiario.endereco?.alugado || false,
    cedido: beneficiario.endereco?.cedido || false,
    heranca: beneficiario.endereco?.heranca || false,
    programaSocial: beneficiario.endereco?.programaSocial || false,
    ocupacao: beneficiario.endereco?.ocupacao || false,
    banheiro: beneficiario.endereco?.banheiro || false,
    aguaEncanada: beneficiario.endereco?.aguaEncanada || false,
    energiaEletrica: beneficiario.endereco?.energiaEletrica || false,
    esgoto: beneficiario.endereco?.esgoto || false,
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setAddressData({
      rua: beneficiario.endereco?.rua || '',
      numero: beneficiario.endereco?.numero || '',
      bairro: beneficiario.endereco?.bairro || '',
      cidade: beneficiario.endereco?.cidade || '',
      cep: beneficiario.endereco?.cep || '',
      complemento: beneficiario.endereco?.complemento || '',
      pontoReferencia: beneficiario.endereco?.pontoReferencia || '',
      numeroComodos: beneficiario.endereco?.numeroComodos || 0,
      proprio: beneficiario.endereco?.proprio || false,
      financiado: beneficiario.endereco?.financiado || false,
      alugado: beneficiario.endereco?.alugado || false,
      cedido: beneficiario.endereco?.cedido || false,
      heranca: beneficiario.endereco?.heranca || false,
      programaSocial: beneficiario.endereco?.programaSocial || false,
      ocupacao: beneficiario.endereco?.ocupacao || false,
      banheiro: beneficiario.endereco?.banheiro || false,
      aguaEncanada: beneficiario.endereco?.aguaEncanada || false,
      energiaEletrica: beneficiario.endereco?.energiaEletrica || false,
      esgoto: beneficiario.endereco?.esgoto || false,
    });
  };

  const handleSave = async () => {
    const addressToSend = {
      rua: addressData.rua || undefined,
      numero: addressData.numero || undefined,
      bairro: addressData.bairro || undefined,
      cidade: addressData.cidade || undefined,
      cep: stripMask(addressData.cep) || undefined,
      complemento: addressData.complemento || undefined,
      pontoReferencia: addressData.pontoReferencia || undefined,
      numeroComodos: addressData.numeroComodos,
      proprio: addressData.proprio,
      financiado: addressData.financiado,
      alugado: addressData.alugado,
      cedido: addressData.cedido,
      heranca: addressData.heranca,
      programaSocial: addressData.programaSocial,
      ocupacao: addressData.ocupacao,
      banheiro: addressData.banheiro,
      aguaEncanada: addressData.aguaEncanada,
      energiaEletrica: addressData.energiaEletrica,
      esgoto: addressData.esgoto,
    };

    const response = await atualizarEndereco({
      beneficiarioId: beneficiarioId,
      body: addressToSend,
    });

    if (response?.success) {
      toast.success('Endereço atualizado com sucesso');
      onRefresh();
      setEditing(false);
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar endereço');
    }
  };

  const renderSwitchField = (value: boolean) => {
    return (
      <div className="flex items-center space-x-2">
        <Switch className="cursor-pointer" checked={value} disabled />
        <Label>{value ? 'Sim' : 'Não'}</Label>
      </div>
    );
  };

  const gridCols = isMobile ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <EditCard
      title="Endereço e Moradia"
      isEditing={editing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!editing ? (
        <div>
          <div className="space-y-2 mb-4">
            <h3 className="font-medium">Informações do endereço</h3>
            {beneficiario.endereco?.rua && beneficiario.endereco?.numero ? (
              <p>
                {beneficiario.endereco.rua}, {beneficiario.endereco.numero}
                {beneficiario.endereco.complemento && ` - ${beneficiario.endereco.complemento}`}
              </p>
            ) : (
              <p>Endereço não informado</p>
            )}
            {beneficiario.endereco?.bairro && beneficiario.endereco?.cidade ? (
              <p>
                {beneficiario.endereco.bairro} - {beneficiario.endereco.cidade}
              </p>
            ) : null}
            {beneficiario.endereco?.cep && <p>CEP: {beneficiario.endereco.cep}</p>}
            {beneficiario.endereco?.pontoReferencia && (
              <p>Ponto de referência: {beneficiario.endereco.pontoReferencia}</p>
            )}
          </div>
          <div className={`grid ${gridCols} gap-4 mb-4`}>
            <div className="space-y-2">
              <h3 className="font-medium">Tipo de Moradia</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Própria:</span>
                  {renderSwitchField(beneficiario.endereco?.proprio || false)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Financiada:</span>
                  {renderSwitchField(beneficiario.endereco?.financiado || false)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Alugada:</span>
                  {renderSwitchField(beneficiario.endereco?.alugado || false)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Cedida:</span>
                  {renderSwitchField(beneficiario.endereco?.cedido || false)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Herança:</span>
                  {renderSwitchField(beneficiario.endereco?.heranca || false)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Programa Social:</span>
                  {renderSwitchField(beneficiario.endereco?.programaSocial || false)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Ocupação:</span>
                  {renderSwitchField(beneficiario.endereco?.ocupacao || false)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Número de Cômodos:</span>
                  <span>{beneficiario.endereco?.numeroComodos || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Infraestrutura</h3>
            <div className={`grid ${gridCols} gap-4`}>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Banheiro:</span>
                {renderSwitchField(beneficiario.endereco?.banheiro || false)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Água Encanada:</span>
                {renderSwitchField(beneficiario.endereco?.aguaEncanada || false)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Energia Elétrica:</span>
                {renderSwitchField(beneficiario.endereco?.energiaEletrica || false)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Esgoto:</span>
                {renderSwitchField(beneficiario.endereco?.esgoto || false)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Informações do endereço</h3>
            <div className={`grid grid-cols-2 gap-4`}>
              <div className="space-y-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={addressData.rua}
                  onChange={(e) => setAddressData({ ...addressData, rua: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={addressData.numero}
                  onChange={(e) => setAddressData({ ...addressData, numero: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={addressData.complemento}
                  onChange={(e) => setAddressData({ ...addressData, complemento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={addressData.bairro}
                  onChange={(e) => setAddressData({ ...addressData, bairro: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={addressData.cidade}
                  onChange={(e) => setAddressData({ ...addressData, cidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={addressData.cep}
                  onChange={(e) => setAddressData({ ...addressData, cep: maskCEP(e.target.value) })}
                  maxLength={9}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="pontoReferencia">Ponto de Referência</Label>
                <Textarea
                  id="pontoReferencia"
                  value={addressData.pontoReferencia}
                  onChange={(e) =>
                    setAddressData({ ...addressData, pontoReferencia: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Tipo de Moradia</h3>
            <div className={`grid grid-cols-2 gap-4`}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="proprio"
                    checked={addressData.proprio}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, proprio: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="proprio">Própria</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="financiado"
                    checked={addressData.financiado}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, financiado: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="financiado">Financiada</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="alugado"
                    checked={addressData.alugado}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, alugado: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="alugado">Alugada</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cedido"
                    checked={addressData.cedido}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, cedido: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="cedido">Cedida</Label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={`grid grid-cols-2 gap-4`}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="heranca"
                    checked={addressData.heranca}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, heranca: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="heranca">Herança</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="programaSocial"
                    checked={addressData.programaSocial}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, programaSocial: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="programaSocial">Programa Social</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ocupacao"
                    checked={addressData.ocupacao}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, ocupacao: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="ocupacao">Ocupação</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroComodos">Número de Cômodos</Label>
                <Select
                  value={String(addressData.numeroComodos)}
                  onValueChange={(value) =>
                    setAddressData({ ...addressData, numeroComodos: Number(value) })
                  }
                >
                  <SelectTrigger id="numeroComodos" className="cursor-pointer">
                    <SelectValue placeholder="Selecione o número de cômodos" />
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

          <div>
            <h3 className="font-medium mb-4">Infraestrutura</h3>
            <div className={`grid grid-cols-2 gap-4`}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="banheiro"
                    checked={addressData.banheiro}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, banheiro: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="banheiro">Banheiro</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aguaEncanada"
                    checked={addressData.aguaEncanada}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, aguaEncanada: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="aguaEncanada">Água Encanada</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="energiaEletrica"
                    checked={addressData.energiaEletrica}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, energiaEletrica: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="energiaEletrica">Energia Elétrica</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="esgoto"
                    checked={addressData.esgoto}
                    onCheckedChange={(checked) =>
                      setAddressData({ ...addressData, esgoto: checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor="esgoto">Esgoto</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </EditCard>
  );
}
