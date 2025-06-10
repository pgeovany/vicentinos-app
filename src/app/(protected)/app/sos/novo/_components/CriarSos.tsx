'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';
import { listarProdutos } from '@/app/(protected)/app/produtos/actions';
import { salvarSos } from '@/app/(protected)/app/sos/actions';
import { generateQuantityOptions } from '@/lib/generate-select-quantity';
import { ProdutoComEstoque } from '@/api/produtos/types';

interface SosItem {
  id: string;
  produtoId: string;
  productName: string;
  quantidade: number;
}

export function CriarSos() {
  const router = useRouter();
  const [productList, setProductList] = useState<SosItem[]>([]);
  const [beneficiario, setBeneficiario] = useState('');
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        const response = await listarProdutos({ pagina: '1', quantidade: '100' });

        if (response.success && response.data) {
          const produtos = response.data.resultado ?? [];

          const prePopulatedItems: SosItem[] = produtos.map((produto: ProdutoComEstoque) => ({
            id: `product-${produto.id}`,
            produtoId: produto.id,
            productName: produto.nome,
            quantidade: 1,
          }));

          setProductList(prePopulatedItems);
        } else {
          toast.error('Erro ao carregar produtos');
        }
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar produtos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const handleRemoveProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast.info('Produto removido da lista');
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantidade: newQuantity } : p)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productList.length === 0) {
      toast.error('Adicione pelo menos um produto');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await salvarSos({
        beneficiario: beneficiario.trim() || undefined,
        motivo: motivo.trim() || undefined,
        itens: productList.map((p) => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade,
        })),
      });

      if (response.success) {
        toast.success('Solicitação SOS registrada com sucesso!');
        router.push('/app/sos/listar');
      } else {
        toast.error(response.error || 'Erro ao registrar solicitação SOS');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar solicitação SOS');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando produtos...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="beneficiario">Assistido (opcional)</Label>
          <Input
            id="beneficiario"
            value={beneficiario}
            onChange={(e) => setBeneficiario(e.target.value)}
            placeholder="Nome do assistido"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivo">Motivo (opcional)</Label>
          <Input
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo da solicitação SOS"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produtos selecionados</CardTitle>
          <CardDescription>
            Todos os produtos estão pré-selecionados com quantidade 1. Remova os que não precisar e
            ajuste as quantidades conforme necessário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum produto selecionado. Todos os produtos foram removidos.
            </p>
          ) : (
            <div className="space-y-4">
              {productList.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.productName}</h4>
                  </div>

                  <div className="w-32">
                    <Select
                      value={product.quantidade.toString()}
                      onValueChange={(value) => handleQuantityChange(product.id, parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover produto</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || productList.length === 0}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            'Salvar SOS'
          )}
        </Button>
      </div>
    </form>
  );
}
