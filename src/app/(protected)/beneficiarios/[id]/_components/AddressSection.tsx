'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { atualizarEndereco } from '../../actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { maskCEP, stripMask } from '@/lib/masks';
import { EditCard } from './EditCard';

interface AddressSectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => void;
}

export function AddressSection({ beneficiario, beneficiarioId, onRefresh }: AddressSectionProps) {
  const [editing, setEditing] = useState(false);
  const [addressData, setAddressData] = useState({
    rua: beneficiario.endereco?.rua || '',
    numero: beneficiario.endereco?.numero || '',
    bairro: beneficiario.endereco?.bairro || '',
    cidade: beneficiario.endereco?.cidade || '',
    cep: beneficiario.endereco?.cep || '',
    complemento: beneficiario.endereco?.complemento || '',
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

  return (
    <EditCard
      title="Endereço"
      isEditing={editing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!editing ? (
        <div className="space-y-2">
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
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      )}
    </EditCard>
  );
}
