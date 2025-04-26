'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { obterEstatisticasSos } from '../../actions';
import { ObterEstatisticasSosDto } from '@/api/sos/schemas';
import { EstatisticasSos as EstatisticasSosType } from '@/api/sos/types';
import { Filter } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

export function EstatisticasSos() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasSosType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);

  const getRequestParams = () => {
    const params: ObterEstatisticasSosDto = {};

    if (dataInicio) params.dataInicio = dataInicio.toISOString();
    if (dataFim) params.dataFim = dataFim.toISOString();

    return params;
  };

  function renderEstatisticasPanel() {
    if (isLoading) {
      return <div className="py-8 text-center text-muted-foreground">Carregando estatísticas…</div>;
    }

    if (!estatisticas) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          Não foi possível obter estatísticas
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-md p-4 bg-primary/5">
            <p className="font-medium">Total de assitências SOS</p>
            <p className="text-2xl font-bold">{estatisticas.totalDistribuicoes}</p>
            <p className="text-sm text-muted-foreground">{getDateRangeText()}</p>
          </div>
          <div className="border rounded-md p-4 bg-green-50">
            <p className="font-medium">Total de itens doados</p>
            <p className="text-2xl font-bold">{estatisticas.totalItensDistribuidos}</p>
            <p className="text-sm text-muted-foreground">
              Média de {estatisticas.mediaItensPorDistribuicao.toFixed(1)} itens por assitência
            </p>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h2 className="text-lg font-bold mb-3">Produtos doados</h2>
          {estatisticas.quantidadePorProduto.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nenhum produto encontrado</div>
          ) : (
            <ProdutosDoadosTable produtos={estatisticas.quantidadePorProduto} />
          )}
        </div>
      </div>
    );
  }

  const getDateRangeText = () => {
    if (dataInicio && dataFim) {
      return `Entre ${formatDate(dataInicio)} e ${formatDate(dataFim)}`;
    } else if (dataInicio) {
      return `A partir de ${formatDate(dataInicio)}`;
    } else if (dataFim) {
      return `Até ${formatDate(dataFim)}`;
    } else {
      return 'Em todo o período';
    }
  };

  const fetchEstatisticas = async () => {
    setIsLoading(true);
    const params = getRequestParams();

    const response = await obterEstatisticasSos(params);

    if (response.success) {
      setEstatisticas(response.data);
    } else {
      toast.error(response.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchEstatisticas();
  }, []); // eslint-disable-line

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEstatisticas();
  };

  const handleClearFilters = () => {
    setDataInicio(undefined);
    setDataFim(undefined);

    setTimeout(() => {
      setIsLoading(true);
      obterEstatisticasSos({})
        .then((response) => {
          if (response.success) {
            setEstatisticas(response.data);
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
      <div className="flex items-center">
        <Button
          variant="outline"
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Button>
      </div>

      {filtersVisible && (
        <Card className="p-4">
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
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
              <Button type="submit">Aplicar Filtros</Button>
            </div>
          </form>
        </Card>
      )}
      {renderEstatisticasPanel()}
    </div>
  );
}

function ProdutosDoadosTable({ produtos }: { produtos: { nome: string; quantidade: number }[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold">Produto</TableHead>
          <TableHead className="font-bold text-right">Quantidade doada</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtos.map((produto, index) => (
          <TableRow
            key={`${produto.nome}-${index}`}
            className={index % 2 === 0 ? 'bg-muted/30' : 'bg-white'}
          >
            <TableCell>{produto.nome}</TableCell>
            <TableCell className="text-right">{produto.quantidade}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
