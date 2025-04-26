'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp, Plus, Trash, Save, Edit } from 'lucide-react';
import { Cesta } from '@/api/cestas/types';
import { adicionarProdutosCesta } from '../../actions';
import { toast } from 'sonner';

interface CestaCardProps {
  cesta: Cesta;
  isExpanded: boolean;
  expandedCestaId: string | null;
  onToggleExpand: (cestaId: string) => void;
  onOpenAddProduct: (cestaId: string) => void;
  onConfirmRemoveProduct: (cestaId: string, produtoId: string, productName: string) => void;
  generateQuantityOptions: (max?: number) => number[];
}

export function CestaCard({
  cesta,
  isExpanded,
  expandedCestaId,
  onToggleExpand,
  onOpenAddProduct,
  onConfirmRemoveProduct,
  generateQuantityOptions,
}: CestaCardProps) {
  const [editingProduct, setEditingProduct] = useState<{
    cestaId: string;
    produtoId: string;
  } | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);

  const handleEditQuantity = (cestaId: string, produtoId: string, quantidade: number) => {
    setEditingProduct({ cestaId, produtoId });
    setEditQuantity(quantidade);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditQuantity(1);
  };

  const saveQuantity = async () => {
    if (!editingProduct) return;

    try {
      const response = await adicionarProdutosCesta({
        cestaId: editingProduct.cestaId,
        body: {
          produtos: [
            {
              produtoId: editingProduct.produtoId,
              quantidade: editQuantity,
            },
          ],
        },
      });

      if (response.success) {
        toast.success('Quantidade atualizada com sucesso!');
        window.location.reload();
        cancelEdit();
      } else {
        toast.error(response.error || 'Erro ao atualizar quantidade');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar quantidade');
    }
  };

  return (
    <Card key={cesta.id} className="overflow-hidden">
      <CardHeader className="cursor-pointer" onClick={() => onToggleExpand(cesta.id)}>
        <div className="flex items-center justify-between">
          <CardTitle>{cesta.nome}</CardTitle>
          <Button variant="ghost" size="icon">
            {expandedCestaId === cesta.id ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        {cesta.descricao && <CardDescription>{cesta.descricao}</CardDescription>}
      </CardHeader>

      <Collapsible open={isExpanded}>
        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium">Produtos na cesta</h4>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddProduct(cesta.id);
                    }}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Adicionar
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="max-w-xs">
                    Adicione um novo produto ou atualize a quantidade de um produto existente
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            {cesta.produtos && cesta.produtos.length > 0 ? (
              <Table className="border-collapse">
                <TableHeader>
                  <TableRow className="bg-accent">
                    <TableHead className="font-bold py-3 px-4">Nome</TableHead>
                    <TableHead className="font-bold py-3 px-4 text-center">Quantidade</TableHead>
                    <TableHead className="font-bold py-3 px-4 w-[150px] text-center">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cesta.produtos.map((produto) => (
                    <TableRow key={produto.id} className="hover:bg-accent/50">
                      <TableCell className="py-3 px-4">{produto.nome}</TableCell>
                      <TableCell className="py-3 px-4 text-center">
                        {editingProduct &&
                        editingProduct.cestaId === cesta.id &&
                        editingProduct.produtoId === produto.id ? (
                          <Select
                            value={editQuantity.toString()}
                            onValueChange={(value) => setEditQuantity(parseInt(value))}
                          >
                            <SelectTrigger className="w-20 mx-auto cursor-pointer">
                              <SelectValue placeholder="Qtd" />
                            </SelectTrigger>
                            <SelectContent>
                              {generateQuantityOptions().map((quantity) => (
                                <SelectItem key={quantity} value={quantity.toString()}>
                                  {quantity}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          produto.quantidade
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-center">
                        {editingProduct &&
                        editingProduct.cestaId === cesta.id &&
                        editingProduct.produtoId === produto.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-500 hover:text-green-700 hover:bg-green-50"
                              onClick={saveQuantity}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                              onClick={cancelEdit}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() =>
                                    handleEditQuantity(cesta.id, produto.id, produto.quantidade)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>Editar quantidade</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    onConfirmRemoveProduct(cesta.id, produto.id, produto.nome)
                                  }
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>Remover produto</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nenhum produto adicionado a esta cesta
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
