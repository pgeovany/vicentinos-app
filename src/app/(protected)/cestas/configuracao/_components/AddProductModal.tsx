'use client';

import { useState, useEffect } from 'react';
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
import { adicionarProdutosCesta } from '../../actions';
import { toast } from 'sonner';
import { Cesta } from '@/api/cestas/types';
import { generateQuantityOptions } from '@/lib/generate-select-quantity';

interface AddProductModalProps {
  open: boolean;
  cestaId: string | null;
  cestas: Cesta[];
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ProductItem {
  id: string;
  produtoId: string;
  productName: string;
  quantidade: number;
}

export function AddProductModal({
  open,
  cestaId,
  cestas,
  onOpenChange,
  onSuccess,
}: AddProductModalProps) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productList, setProductList] = useState<ProductItem[]>([]);

  const currentCesta = cestas.find((c) => c.id === cestaId);
  const existingProduct = currentCesta?.produtos?.find((p) => p.id === selectedProduct);
  const isUpdating = !!existingProduct;

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
      const nameToUse = existingProduct?.nome || selectedProductName || selectedProduct;
      setProductList((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          produtoId: selectedProduct,
          productName: nameToUse,
          quantidade: quantity,
        },
      ]);
      toast.success('Produto adicionado à lista');
    }

    setSelectedProduct('');
    setSelectedProductName('');
    setQuantity(1);
  };

  const handleRemoveProduct = (produtoId: string) => {
    setProductList((prev) => prev.filter((p) => p.produtoId !== produtoId));
    toast.info('Produto removido da lista');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cestaId) return;

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
          const nameToUse = existingProduct?.nome || selectedProductName || selectedProduct;
          productsToSubmit.push({
            id: `temp-${Date.now()}`,
            produtoId: selectedProduct,
            productName: nameToUse,
            quantidade: quantity,
          });
        }
      }

      const response = await adicionarProdutosCesta({
        cestaId,
        body: {
          produtos: productsToSubmit.map((p) => ({
            produtoId: p.produtoId,
            quantidade: p.quantidade,
          })),
        },
      });

      if (response.success) {
        toast.success('Produtos adicionados com sucesso!');
        setSelectedProduct('');
        setSelectedProductName('');
        setQuantity(1);
        setProductList([]);
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(response.error || 'Erro ao adicionar produtos');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao adicionar produtos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedProduct('');
    setSelectedProductName('');
    setQuantity(1);
    setProductList([]);
    onOpenChange(false);
  };

  useEffect(() => {
    if (existingProduct) {
      setQuantity(existingProduct.quantidade);
    } else {
      setQuantity(1);
    }
  }, [existingProduct, selectedProduct]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Adicionar Produtos</SheetTitle>
          <SheetDescription>Adicione um ou mais produtos à cesta selecionada</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-4">
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
            {isUpdating && (
              <p className="text-sm text-amber-600">
                Este produto já existe na cesta. A quantidade será atualizada.
              </p>
            )}
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
              Adicionar à Lista
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
                        onClick={() => handleRemoveProduct(product.produtoId)}
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
                {isSubmitting ? 'Adicionando...' : 'Salvar Produtos'}
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
