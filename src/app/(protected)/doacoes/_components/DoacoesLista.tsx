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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { formatDate } from '@/lib/format-date';
import { listarDoacoes } from '../actions';
import { ListarDoacoesDto } from '@/api/doacoes/schemas';
import {
  ENUM_RECEBIMENTO_DOACAO_ORIGEM,
  ListarDoacoes,
  RecebimentoDoacao,
} from '@/api/doacoes/types';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Filter, Plus } from 'lucide-react';
import { getOrigemDoacaoLabel } from '../helpers';
import { NewDonationModal } from './NewDonationModal';

export function DoacoesLista() {
  const [doacoes, setDoacoes] = useState<ListarDoacoes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [newDonationModalOpen, setNewDonationModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [origemDoacao, setOrigemDoacao] = useState('todos');
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);

  const getRequestParams = () => {
    const params: ListarDoacoesDto = {
      pagina: page.toString(),
      quantidade: '40',
    };

    if (origemDoacao !== 'todos') {
      params.origem = origemDoacao as ENUM_RECEBIMENTO_DOACAO_ORIGEM;
    }

    if (dataInicio) params.dataInicio = dataInicio.toISOString();
    if (dataFim) params.dataFim = dataFim.toISOString();

    return params;
  };

  const fetchDoacoes = async () => {
    setIsLoading(true);
    const params = getRequestParams();

    const response = await listarDoacoes(params);

    if (response.success) {
      setDoacoes(response.data);
    } else {
      toast.error(response.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDoacoes();
  }, [page]); // eslint-disable-line

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDoacoes();
  };

  const handleClearFilters = () => {
    setOrigemDoacao('todos');
    setDataInicio(undefined);
    setDataFim(undefined);
    setPage(1);

    setTimeout(() => {
      const params: ListarDoacoesDto = {
        pagina: '1',
        quantidade: '15',
      };

      setIsLoading(true);
      listarDoacoes(params)
        .then((response) => {
          if (response.success) {
            setDoacoes(response.data);
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
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Button>
        <Button onClick={() => setNewDonationModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova doação
        </Button>
      </div>

      {filtersVisible && (
        <Card className="p-4">
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="origem">Origem da Doação</Label>
              <RadioGroup
                id="origem"
                value={origemDoacao}
                onValueChange={setOrigemDoacao}
                className="flex flex-wrap gap-x-4 gap-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="todos" id="todos" />
                  <Label htmlFor="todos" className="cursor-pointer">
                    Todos
                  </Label>
                </div>
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
          <div className="py-8 text-center text-muted-foreground">Carregando doações...</div>
        ) : (
          <>
            {!doacoes?.resultado || doacoes.resultado.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhuma doação encontrada
              </div>
            ) : (
              <DoacoesTable doacoes={doacoes.resultado} />
            )}
          </>
        )}
      </div>

      {doacoes && doacoes.totalPaginas > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Página {page} de {doacoes.totalPaginas}
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
              onClick={() => setPage((p) => Math.min(doacoes.totalPaginas, p + 1))}
              disabled={page >= doacoes.totalPaginas}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {doacoes && (
        <div className="text-sm text-muted-foreground text-right">
          {doacoes.resultado.length} doação(ões) encontrada(s)
        </div>
      )}

      <NewDonationModal
        open={newDonationModalOpen}
        onOpenChange={setNewDonationModalOpen}
        onSuccess={fetchDoacoes}
      />
    </div>
  );
}

function DoacoesTable({ doacoes }: { doacoes: Readonly<RecebimentoDoacao[]> }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold">Origem</TableHead>
          <TableHead className="font-bold">Data</TableHead>
          <TableHead className="font-bold">Itens</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doacoes.map((doacao) => (
          <DoacaoRow key={doacao.id} doacao={doacao} />
        ))}
      </TableBody>
    </Table>
  );
}

function DoacaoRow({ doacao }: { doacao: Readonly<RecebimentoDoacao> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow
        className={`hover:bg-accent/50 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <TableCell>
          <Badge className="font-normal">{getOrigemDoacaoLabel(doacao.origem)}</Badge>
        </TableCell>
        <TableCell>{formatDate(doacao.criadoEm)}</TableCell>
        <TableCell className="flex items-center justify-between">
          <span>{doacao.itens.length} item(ns)</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow className="border-t-0">
          <TableCell colSpan={3} className="p-0 pb-4">
            <div className="mx-4 mt-2 p-4 bg-card border rounded-md shadow-sm">
              <h4 className="font-semibold mb-3 text-lg text-center">Itens da doação</h4>
              <div className="flex justify-center">
                <div className="w-4/5 sm:w-full md:w-full lg:w-full overflow-x-auto">
                  <Table className="w-full border">
                    <TableHeader>
                      <TableRow className="bg-primary/10">
                        <TableHead className="font-medium  py-2 w-3/4">Produto</TableHead>
                        <TableHead className="font-medium  text-center py-2 w-1/4">
                          Quantidade
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-accent/20">
                      {doacao.itens.map((item) => (
                        <TableRow key={item.id} className="hover:bg-accent/40">
                          <TableCell className="py-2">{item.nome}</TableCell>
                          <TableCell className="text-center py-2">{item.quantidade}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
