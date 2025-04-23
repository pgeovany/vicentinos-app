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
import { Search } from 'lucide-react';

export function ProdutosEstoque() {
  const [estoqueData, setEstoqueData] = useState<AnalisarEstoque | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
              <EstoqueTable produtos={filteredProdutos} />
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
}: Readonly<{
  produtos: Array<{
    id: string;
    nome: string;
    quantidadeReservada: number;
    quantidadeDisponivel: number;
    saldo: number;
    suficiente: boolean;
  }>;
}>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold">Nome</TableHead>
          <TableHead className="font-bold">Qtd. Disponível</TableHead>
          <TableHead className="font-bold">Qtd. Reservada</TableHead>
          <TableHead className="font-bold">Saldo</TableHead>
          <TableHead className="font-bold">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtos.map((produto) => (
          <TableRow
            className={`hover:bg-accent/50 ${!produto.suficiente ? 'bg-red-50' : 'bg-green-50'}`}
            key={produto.id}
          >
            <TableCell>{produto.nome}</TableCell>
            <TableCell>{produto.quantidadeDisponivel}</TableCell>
            <TableCell>{produto.quantidadeReservada}</TableCell>
            <TableCell>{produto.saldo}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  produto.suficiente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {produto.suficiente ? 'Suficiente' : 'Insuficiente'}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
