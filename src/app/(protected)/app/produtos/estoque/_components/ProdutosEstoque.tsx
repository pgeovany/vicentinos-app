'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarEstoque } from '../../actions';
import { AnalisarEstoque } from '@/api/estoque/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RemoverProdutoDialog } from './RemoverProdutoDialog';

export function ProdutosEstoque() {
  const [estoqueData, setEstoqueData] = useState<AnalisarEstoque | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchEstoque = async () => {
    setIsLoading(true);
    const response = await listarEstoque();

    if (response.success) {
      setEstoqueData(response.data);
    } else {
      toast.error(response.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

  const filteredProdutos =
    estoqueData?.produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(filterValue.toLowerCase()),
    ) || [];

  return (
    <div className="space-y-4">
      {estoqueData && (
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-md p-4 bg-green-50">
            <p className="font-medium">Produtos suficientes</p>
            <p className="text-2xl font-bold">{estoqueData.totais.produtosSuficientes}</p>
          </div>
          <div className="border rounded-md p-4 bg-red-50">
            <p className="font-medium">Produtos insuficientes</p>
            <p className="text-2xl font-bold">{estoqueData.totais.produtosInsuficientes}</p>
          </div>
        </div>
      )}

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrar por nome..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="border rounded-md p-2">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando dados do estoque...
          </div>
        ) : (
          <>
            {filteredProdutos.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhum produto encontrado no estoque
              </div>
            ) : (
              <EstoqueTable produtos={filteredProdutos} onRefresh={fetchEstoque} />
            )}
          </>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-right">
        {filteredProdutos.length} produto(s) encontrado(s)
      </div>
    </div>
  );
}

function EstoqueTable({
  produtos,
  onRefresh,
}: Readonly<{
  produtos: Array<{
    id: string;
    nome: string;
    quantidadeReservada: number;
    quantidadeDisponivel: number;
    saldo: number;
    suficiente: boolean;
  }>;
  onRefresh: () => Promise<void>;
}>) {
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    nome: string;
    quantidadeDisponivel: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (produto: {
    id: string;
    nome: string;
    quantidadeDisponivel: number;
  }) => {
    if (produto.quantidadeDisponivel > 0) {
      setSelectedProduct(produto);
      setIsDialogOpen(true);
    } else {
      toast.error('Produto não pode ser removido, pois não há unidades disponíveis.');
    }
  };

  return (
    <>
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="bg-accent">
            <TableHead className="font-bold py-3 px-4">Nome</TableHead>
            <TableHead className="font-bold py-3 px-4 text-center">Qtd. Disponível</TableHead>
            <TableHead className="font-bold py-3 px-4 text-center">Qtd. Reservada</TableHead>
            <TableHead className="font-bold py-3 px-4 text-center">Saldo</TableHead>
            <TableHead className="font-bold py-3 px-4 text-center">Status</TableHead>
            <TableHead className="font-bold py-3 px-4 text-center w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow
              className={`hover:bg-accent/50 ${!produto.suficiente ? 'bg-red-50' : 'bg-green-50'}`}
              key={produto.id}
            >
              <TableCell className="py-3 px-4">{produto.nome}</TableCell>
              <TableCell className="py-3 px-4 text-center">
                {produto.quantidadeDisponivel}
              </TableCell>
              <TableCell className="py-3 px-4 text-center">{produto.quantidadeReservada}</TableCell>
              <TableCell className="py-3 px-4 text-center">{produto.saldo}</TableCell>
              <TableCell className="py-3 px-4 text-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    produto.suficiente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {produto.suficiente ? 'Suficiente' : 'Insuficiente'}
                </span>
              </TableCell>
              <TableCell className="py-3 px-4 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleOpenDialog({
                      id: produto.id,
                      nome: produto.nome,
                      quantidadeDisponivel: produto.quantidadeDisponivel,
                    })
                  }
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  title="Remover produto do estoque (apenas para itens expirados ou danificados)"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProduct && (
        <RemoverProdutoDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          produto={selectedProduct}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
