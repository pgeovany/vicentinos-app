'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProductSelect } from '@/components/ui/product-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { ENUM_RECEBIMENTO_DOACAO_ORIGEM } from '@/api/doacoes/types';
import { getOrigemDoacaoLabel } from '../../helpers';
import { generateQuantityOptions } from '@/lib/generate-select-quantity';
import { salvarDoacao } from '../../actions';

interface NewDonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface DonationItem {
  id: string;
  produtoId: string;
  productName: string;
  quantidade: number;
}

export function NewDonationModal({ open, onOpenChange, onSuccess }: NewDonationModalProps) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productList, setProductList] = useState<DonationItem[]>([]);
  const [origemDoacao, setOrigemDoacao] = useState<ENUM_RECEBIMENTO_DOACAO_ORIGEM>(
    ENUM_RECEBIMENTO_DOACAO_ORIGEM.MISSA_DOMINGO,
  );

  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast.error('Selecione um produto');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantidade deve ser maior que zero');
      return;
    }

    const existingInList = productList.find((p) => p.produtoId === selectedProduct);

    if (existingInList) {
      setProductList((prev) =>
        prev.map((p) => (p.produtoId === selectedProduct ? { ...p, quantidade: quantity } : p)),
      );
      toast.info('Quantidade do produto atualizada na lista');
    } else {
      setProductList((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          produtoId: selectedProduct,
          productName: selectedProductName || selectedProduct,
          quantidade: quantity,
        },
      ]);
      toast.success('Produto adicionado à lista');
    }

    setSelectedProduct('');
    setSelectedProductName('');
    setQuantity(1);
  };

  const handleRemoveProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast.info('Produto removido da lista');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productList.length === 0 && !selectedProduct) {
      toast.error('Adicione pelo menos um produto');
      return;
    }

    setIsSubmitting(true);

    try {
      const productsToSubmit = [...productList];

      if (selectedProduct) {
        const existingInList = productList.find((p) => p.produtoId === selectedProduct);
        if (!existingInList) {
          productsToSubmit.push({
            id: `temp-${Date.now()}`,
            produtoId: selectedProduct,
            productName: selectedProductName || selectedProduct,
            quantidade: quantity,
          });
        }
      }

      const response = await salvarDoacao({
        origem: origemDoacao,
        itens: productsToSubmit.map((p) => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade,
        })),
      });

      if (response.success) {
        toast.success('Doação registrada com sucesso!');
        setSelectedProduct('');
        setSelectedProductName('');
        setQuantity(1);
        setProductList([]);
        setOrigemDoacao(ENUM_RECEBIMENTO_DOACAO_ORIGEM.CAMPANHA);
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(response.error || 'Erro ao registrar doação');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar doação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedProduct('');
    setSelectedProductName('');
    setQuantity(1);
    setProductList([]);
    setOrigemDoacao(ENUM_RECEBIMENTO_DOACAO_ORIGEM.CAMPANHA);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Registrar Nova Doação</SheetTitle>
          <SheetDescription>Adicione produtos recebidos como doação</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2 px-4">
            <Label htmlFor="origem">Origem da Doação</Label>
            <RadioGroup
              id="origem"
              value={origemDoacao}
              onValueChange={(value) => setOrigemDoacao(value as ENUM_RECEBIMENTO_DOACAO_ORIGEM)}
              className="flex flex-wrap gap-x-4 gap-y-2"
            >
              {Object.entries(ENUM_RECEBIMENTO_DOACAO_ORIGEM).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={key} />
                  <Label htmlFor={key} className="cursor-pointer">
                    {getOrigemDoacaoLabel(value)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2 px-4">
            <Label htmlFor="produto">Produto</Label>
            <ProductSelect
              value={selectedProduct}
              onValueChange={(value, name) => {
                setSelectedProduct(value);
                setSelectedProductName(name || '');
              }}
              className="w-full"
              includeAllOption={false}
            />
          </div>

          <div className="space-y-2 px-4">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Select
              value={quantity.toString()}
              onValueChange={(value) => setQuantity(parseInt(value))}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Selecione a quantidade" />
              </SelectTrigger>
              <SelectContent>
                {generateQuantityOptions().map((qty) => (
                  <SelectItem key={qty} value={qty.toString()}>
                    {qty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="px-4">
            <Button type="button" onClick={handleAddProduct} variant="secondary" className="w-full">
              Adicionar à lista
            </Button>
          </div>

          {productList.length > 0 && (
            <div className="px-4 pt-2">
              <h3 className="text-sm font-medium mb-2">Produtos selecionados:</h3>
              <div className="border rounded-md p-2 bg-muted/30">
                <ul className="space-y-2">
                  {productList.map((product) => (
                    <li key={product.id} className="flex items-center justify-between text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium">{product.productName}</span>
                        <span className="text-xs text-muted-foreground">
                          Quantidade: {product.quantidade}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (productList.length === 0 && !selectedProduct)}
              >
                {isSubmitting ? 'Registrando...' : 'Salvar doação'}
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
