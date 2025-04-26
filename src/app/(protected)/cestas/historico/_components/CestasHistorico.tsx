'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarHistoricoDistribuicoesCestas, listarTiposCestas } from '../../actions';
import { ListarHistoricoDistribuicoes } from '@/api/cestas/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListarHistoricoDistribuicoesDto } from '@/api/cestas/schemas';

export function CestasHistorico() {
  const [historicoDistribuicoes, setHistoricoDistribuicoes] =
    useState<ListarHistoricoDistribuicoes | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [filterName, setFilterName] = useState('');

  const today = new Date();
  let initMonth = today.getMonth() - 1;
  let initYear = today.getFullYear();

  if (initMonth < 0) {
    initMonth = 11;
    initYear -= 1;
  }

  const [selectedMonth, setSelectedMonth] = useState(initMonth.toString());
  const [selectedYear, setSelectedYear] = useState(initYear.toString());
  const [selectedTipoCesta, setSelectedTipoCesta] = useState('');
  const [tiposCesta, setTiposCesta] = useState<Array<{ id: string; nome: string }>>([]);
  const [isLoadingTiposCesta, setIsLoadingTiposCesta] = useState(true);

  const hasActiveFilters = filterName !== '' || selectedTipoCesta !== '';

  useEffect(() => {
    const today = new Date();
    let month = today.getMonth() - 1;
    let year = today.getFullYear();

    if (month < 0) {
      month = 11;
      year -= 1;
    }

    setSelectedMonth(month.toString());
    setSelectedYear(year.toString());
  }, []);

  useEffect(() => {
    const fetchTiposCesta = async () => {
      try {
        setIsLoadingTiposCesta(true);
        const response = await listarTiposCestas();

        if (response.success && response.data) {
          setTiposCesta(response.data.cestas);
        } else {
          toast.error('Erro ao carregar tipos de cestas');
        }
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar tipos de cestas');
      } finally {
        setIsLoadingTiposCesta(false);
      }
    };

    fetchTiposCesta();
  }, []);

  const getRequestParams = () => {
    const params: ListarHistoricoDistribuicoesDto = {
      pagina: '1',
      quantidade: '100',
      mes: selectedMonth,
      ano: selectedYear,
    };

    if (filterName) {
      params.nome = filterName;
    }

    if (selectedTipoCesta && selectedTipoCesta !== 'all') {
      params.tipoCestaId = selectedTipoCesta;
    }

    return params;
  };

  const fetchHistoricoDistribuicoes = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.error('Mês e ano são obrigatórios');
      return;
    }

    setIsLoading(true);
    const params = getRequestParams();

    const response = await listarHistoricoDistribuicoesCestas(params);

    if (response.success) {
      setHistoricoDistribuicoes(response.data);
    } else {
      toast.error(response.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchHistoricoDistribuicoes();
    }
  }, [selectedMonth, selectedYear]); // eslint-disable-line

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistoricoDistribuicoes();
  };

  const handleClearFilters = () => {
    setFilterName('');
    setSelectedTipoCesta('');

    setTimeout(() => {
      fetchHistoricoDistribuicoes();
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
              Sem filtros de nome/tipo aplicados
            </div>
          )}
        </div>
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do assistido</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  placeholder="Filtrar por nome..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoCesta">Tipo de cesta</Label>
              <Select
                value={selectedTipoCesta}
                onValueChange={setSelectedTipoCesta}
                disabled={isLoadingTiposCesta}
              >
                <SelectTrigger id="tipoCesta" className="w-full cursor-pointer">
                  <SelectValue
                    placeholder={
                      isLoadingTiposCesta ? 'Carregando...' : 'Selecione o tipo de cesta'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {isLoadingTiposCesta ? (
                    <SelectItem value="loading" disabled>
                      Carregando tipos de cestas...
                    </SelectItem>
                  ) : (
                    tiposCesta.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mes">Mês</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth} required>
                <SelectTrigger id="mes" className="w-full cursor-pointer">
                  {/* ⬇️  placeholder is only shown while value === "" */}
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Janeiro</SelectItem>
                  <SelectItem value="1">Fevereiro</SelectItem>
                  <SelectItem value="2">Março</SelectItem>
                  <SelectItem value="3">Abril</SelectItem>
                  <SelectItem value="4">Maio</SelectItem>
                  <SelectItem value="5">Junho</SelectItem>
                  <SelectItem value="6">Julho</SelectItem>
                  <SelectItem value="7">Agosto</SelectItem>
                  <SelectItem value="8">Setembro</SelectItem>
                  <SelectItem value="9">Outubro</SelectItem>
                  <SelectItem value="10">Novembro</SelectItem>
                  <SelectItem value="11">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear} required>
                <SelectTrigger id="ano" className="w-full">
                  <SelectValue defaultValue={selectedYear} />
                </SelectTrigger>
                <SelectContent>
                  {/* Years from current year - 5 to current year */}
                  {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 5 + i).map(
                    (year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
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
          <div className="py-8 text-center text-muted-foreground">Carregando histórico...</div>
        ) : (
          <>
            {!historicoDistribuicoes?.distribuicoes ||
            historicoDistribuicoes.distribuicoes.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhuma distribuição encontrada para o período selecionado
              </div>
            ) : (
              <HistoricoTable distribuicoes={historicoDistribuicoes.distribuicoes} />
            )}
          </>
        )}
      </div>

      {historicoDistribuicoes && (
        <div className="text-sm text-muted-foreground text-right">
          {historicoDistribuicoes.total} distribuição(ões) encontrada(s)
        </div>
      )}
    </div>
  );
}

function HistoricoTable({
  distribuicoes,
}: Readonly<{
  distribuicoes: Array<{
    id: string;
    criadoEm: string;
    beneficiario: {
      id: string;
      nome: string;
    };
    tipoCesta: {
      id: string;
      nome: string;
    };
  }>;
}>) {
  return (
    <Table className="border-collapse">
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold py-3 px-4">Assistido</TableHead>
          <TableHead className="font-bold py-3 px-4 text-center">Tipo de Cesta</TableHead>
          <TableHead className="font-bold py-3 px-4 text-center">Data de Entrega</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {distribuicoes.map((distribuicao) => (
          <TableRow className="hover:bg-accent/50" key={distribuicao.id}>
            <TableCell className="py-3 px-4">{distribuicao.beneficiario.nome}</TableCell>
            <TableCell className="py-3 px-4 text-center">{distribuicao.tipoCesta.nome}</TableCell>
            <TableCell className="py-3 px-4 text-center">
              {formatDate(distribuicao.criadoEm)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
