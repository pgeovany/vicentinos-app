'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarMovimentacoesTotais } from '../../actions';
import { ListarMovimentacaoTotais } from '@/api/estoque/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { ListarEntradasESaidasDto } from '@/api/estoque/schemas';

export function MovimentacoesTotais() {
  const [totais, setTotais] = useState<ListarMovimentacaoTotais | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);

  const hasActiveFilters = dataInicio !== undefined || dataFim !== undefined;

  const getRequestParams = () => {
    const params: ListarEntradasESaidasDto = {
      pagina: 1,
      quantidade: 100,
    };

    if (dataInicio) params.dataInicio = dataInicio.toISOString().split('T')[0];
    if (dataFim) params.dataFim = dataFim.toISOString().split('T')[0];

    return params;
  };

  const fetchTotais = async () => {
    setIsLoading(true);
    const params = getRequestParams();

    const response = await listarMovimentacoesTotais(params);

    if (response.success) {
      setTotais(response.data);
    } else {
      toast.error(response.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchTotais();
  }, []); // eslint-disable-line

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTotais();
  };

  const handleClearFilters = () => {
    setDataInicio(undefined);
    setDataFim(undefined);

    setTimeout(() => {
      const params: ListarEntradasESaidasDto = {
        pagina: 1,
        quantidade: 100,
      };

      setIsLoading(true);
      listarMovimentacoesTotais(params)
        .then((response) => {
          if (response.success) {
            setTotais(response.data);
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
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Filtros</h3>
          {hasActiveFilters ? (
            <div className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              Filtros ativos
            </div>
          ) : (
            <div className="px-3 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
              Sem filtros aplicados
            </div>
          )}
        </div>
        <form onSubmit={handleFilterSubmit} className="space-y-4">
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
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Limpar Filtros
            </Button>
            <Button type="submit">Aplicar Filtros</Button>
          </div>
        </form>
      </Card>

      <div className="border rounded-md p-2">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando totais...</div>
        ) : (
          <>
            {!totais?.resultado || totais.resultado.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhum registro encontrado
              </div>
            ) : (
              <TotaisTable totais={totais.resultado} />
            )}
          </>
        )}
      </div>

      {totais && (
        <div className="text-sm text-muted-foreground text-right">
          {totais.resultado.length} produto(s) encontrado(s)
        </div>
      )}
    </div>
  );
}

function TotaisTable({
  totais,
}: Readonly<{
  totais: Array<{
    produtoId: string;
    nome: string;
    totalEntradas: number;
    totalSaidas: number;
  }>;
}>) {
  return (
    <Table className="border-collapse">
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold py-3 px-4">Produto</TableHead>
          <TableHead className="font-bold py-3 px-4 text-center">Total Entradas</TableHead>
          <TableHead className="font-bold py-3 px-4 text-center">Total Saídas</TableHead>
          <TableHead className="font-bold py-3 px-4 text-center">Saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {totais.map((total) => {
          const saldo = total.totalEntradas - total.totalSaidas;
          return (
            <TableRow
              className={`hover:bg-accent/50 ${saldo >= 0 ? 'bg-green-50' : 'bg-red-50'}`}
              key={total.produtoId}
            >
              <TableCell className="py-3 px-4">{total.nome}</TableCell>
              <TableCell className="py-3 px-4 text-center text-green-600">
                {total.totalEntradas}
              </TableCell>
              <TableCell className="py-3 px-4 text-center text-red-600">
                {total.totalSaidas}
              </TableCell>
              <TableCell
                className={`py-3 px-4 text-center ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {saldo}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
