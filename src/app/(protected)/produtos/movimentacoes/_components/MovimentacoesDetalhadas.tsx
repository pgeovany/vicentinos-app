'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarMovimentacoesEstoque } from '../../actions';
import { ListarMovimentacoesEstoque } from '@/api/estoque/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { formatDate } from '@/lib/format-date';
import { ProductSelect } from '@/components/ui/product-select';
import { ListarMovimentacoesEstoqueDto } from '@/api/estoque/schemas';

const TIPOS_MOVIMENTACAO = {
  TODOS: 'todos',
  ENTRADA: 'ENTRADA',
  SAIDA: 'SAIDA',
};

export function MovimentacoesDetalhadas({ filtersVisible }: { filtersVisible: boolean }) {
  const [movimentacoes, setMovimentacoes] = useState<ListarMovimentacoesEstoque | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState('todos');
  const [tipoMovimentacao, setTipoMovimentacao] = useState(TIPOS_MOVIMENTACAO.TODOS);
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);

  const getRequestParams = () => {
    const params: ListarMovimentacoesEstoqueDto = {
      pagina: page,
      quantidade: 30,
    };

    if (selectedProduct && selectedProduct !== 'todos') {
      params.nome = selectedProduct;
    }

    if (tipoMovimentacao !== TIPOS_MOVIMENTACAO.TODOS) {
      params.tipo = tipoMovimentacao as 'ENTRADA' | 'SAIDA' | undefined;
    }
    if (dataInicio) params.dataInicio = dataInicio.toISOString().split('T')[0];
    if (dataFim) params.dataFim = dataFim.toISOString().split('T')[0];

    return params;
  };

  const fetchMovimentacoes = async () => {
    setIsLoading(true);
    const params = getRequestParams();

    console.log('Requesting with params:', params);
    const response = await listarMovimentacoesEstoque(params);

    if (response.success) {
      setMovimentacoes(response.data);
    } else {
      toast.error(response.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, [page]); // eslint-disable-line

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMovimentacoes();
  };

  const handleClearFilters = () => {
    setSelectedProduct('todos');
    setTipoMovimentacao(TIPOS_MOVIMENTACAO.TODOS);
    setDataInicio(undefined);
    setDataFim(undefined);
    setPage(1);

    setTimeout(() => {
      const params: ListarMovimentacoesEstoqueDto = {
        pagina: 1,
        quantidade: 30,
      };

      setIsLoading(true);
      listarMovimentacoesEstoque(params)
        .then((response) => {
          if (response.success) {
            setMovimentacoes(response.data);
          } else {
            toast.error(response.error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 0);
  };

  return (
    <div className="space-y-4">
      {filtersVisible && (
        <Card className="p-4">
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <ProductSelect
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                  className="w-full"
                  filterBy="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Movimentação</Label>
                <RadioGroup
                  id="tipo"
                  value={tipoMovimentacao}
                  onValueChange={setTipoMovimentacao}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TIPOS_MOVIMENTACAO.TODOS} id="todos" />
                    <Label htmlFor="todos" className="cursor-pointer">
                      Todos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TIPOS_MOVIMENTACAO.ENTRADA} id="entradas" />
                    <Label htmlFor="entradas" className="cursor-pointer">
                      Entradas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TIPOS_MOVIMENTACAO.SAIDA} id="saidas" />
                    <Label htmlFor="saidas" className="cursor-pointer">
                      Saídas
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <CustomDatePicker
                  date={dataInicio}
                  onSelect={setDataInicio}
                  placeholder="Selecionar data inicial"
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Fim</Label>
                <CustomDatePicker
                  date={dataFim}
                  onSelect={setDataFim}
                  placeholder="Selecionar data final"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
              <Button type="submit">Aplicar Filtros</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="border rounded-md p-2">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando movimentações...</div>
        ) : (
          <>
            {!movimentacoes?.resultado || movimentacoes.resultado.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhuma movimentação encontrada
              </div>
            ) : (
              <MovimentacoesTable movimentacoes={movimentacoes.resultado} />
            )}
          </>
        )}
      </div>

      {movimentacoes && movimentacoes.totalPaginas > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Página {page} de {movimentacoes.totalPaginas}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(movimentacoes.totalPaginas, p + 1))}
              disabled={page >= movimentacoes.totalPaginas}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {movimentacoes && (
        <div className="text-sm text-muted-foreground text-right">
          {movimentacoes.resultado.length} movimentação(ões) encontrada(s)
        </div>
      )}
    </div>
  );
}

function MovimentacoesTable({
  movimentacoes,
}: Readonly<{
  movimentacoes: Array<{
    id: string;
    produtoId: string;
    produto: string;
    estoqueProdutoId: string;
    quantidade: number;
    tipo: string;
    motivo?: string;
    criadoEm: string;
    atualizadoEm: string;
  }>;
}>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold">Produto</TableHead>
          <TableHead className="font-bold">Quantidade</TableHead>
          <TableHead className="font-bold">Tipo</TableHead>
          <TableHead className="font-bold">Motivo</TableHead>
          <TableHead className="font-bold">Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movimentacoes.map((movimentacao) => (
          <TableRow
            className={`hover:bg-accent/50 ${
              movimentacao.tipo.includes('ENTRADA') ? 'bg-green-50' : 'bg-red-50'
            }`}
            key={movimentacao.id}
          >
            <TableCell>{movimentacao.produto}</TableCell>
            <TableCell>{movimentacao.quantidade}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  movimentacao.tipo.includes('ENTRADA')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {movimentacao.tipo.includes('ENTRADA') ? 'Entrada' : 'Saída'}
              </span>
            </TableCell>
            <TableCell>{movimentacao.motivo || '--'}</TableCell>
            <TableCell>{formatDate(movimentacao.criadoEm)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
