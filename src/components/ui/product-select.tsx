'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listarProdutos } from '@/app/(protected)/produtos/actions';

type Produto = {
  id: string;
  nome: string;
  descricao?: string;
  status: string;
};

export type FilterBy = 'id' | 'name';

type ProductSelectProps = Readonly<{
  value: string;
  onValueChange: (value: string, name?: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  filterBy?: FilterBy;
}>;

export function ProductSelect({
  value,
  onValueChange,
  disabled = false,
  className = '',
  placeholder = 'Selecione um produto',
  includeAllOption = true,
  allOptionLabel = 'Todos os produtos',
  allOptionValue = 'todos',
  filterBy = 'id',
}: ProductSelectProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoadingProdutos(true);
        const response = await listarProdutos({ pagina: '1', quantidade: '100' });

        if (response.success && response.data) {
          setProdutos(response.data.resultado ?? []);
        } else {
          toast.error('Erro ao carregar produtos');
        }
      } catch {
        toast.error('Erro ao carregar produtos');
      } finally {
        setIsLoadingProdutos(false);
      }
    };

    fetchProdutos();
  }, []);

  const getItemValue = (produto: Produto) => {
    return filterBy === 'id' ? produto.id : produto.nome;
  };

  return (
    <Select
      disabled={disabled || isLoadingProdutos}
      value={value}
      onValueChange={(newValue) => {
        if (newValue === allOptionValue) {
          onValueChange(newValue);
        } else {
          const selectedProduct = produtos.find((p) => getItemValue(p) === newValue);
          onValueChange(newValue, selectedProduct?.nome);
        }
      }}
    >
      <SelectTrigger className={`cursor-pointer ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem className="cursor-pointer" value={allOptionValue}>
            {allOptionLabel}
          </SelectItem>
        )}
        {produtos.map((produto) => (
          <SelectItem className="cursor-pointer" key={produto.id} value={getItemValue(produto)}>
            {produto.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
