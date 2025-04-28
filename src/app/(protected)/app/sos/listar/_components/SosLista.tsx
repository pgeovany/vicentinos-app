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
import { formatDate } from '@/lib/format-date';
import { listarSos } from '../../actions';
import { ListarSosDto } from '@/api/sos/schemas';
import { ListarSos, Sos } from '@/api/sos/types';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Filter, Plus } from 'lucide-react';
import { NewSosModal } from './NewSosModal';

export function SosLista() {
  const [solicitacoes, setSolicitacoes] = useState<ListarSos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [newSosModalOpen, setNewSosModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);

  const getRequestParams = () => {
    const params: ListarSosDto = {
      pagina: page.toString(),
      quantidade: '40',
    };

    if (dataInicio) params.dataInicio = dataInicio.toISOString();
    if (dataFim) params.dataFim = dataFim.toISOString();

    return params;
  };

  const fetchSolicitacoes = async () => {
    setIsLoading(true);
    const params = getRequestParams();

    const response = await listarSos(params);

    if (response.success) {
      setSolicitacoes(response.data);
    } else {
      toast.error(response.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, [page]); // eslint-disable-line

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSolicitacoes();
  };

  const handleClearFilters = () => {
    setDataInicio(undefined);
    setDataFim(undefined);
    setPage(1);

    setTimeout(() => {
      const params: ListarSosDto = {
        pagina: '1',
        quantidade: '40',
      };

      setIsLoading(true);
      listarSos(params)
        .then((response) => {
          if (response.success) {
            setSolicitacoes(response.data);
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
        <Button onClick={() => setNewSosModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo SOS
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

      <div className="border rounded-md p-2">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando solicitações SOS...
          </div>
        ) : (
          <>
            {!solicitacoes?.resultado || solicitacoes.resultado.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhuma solicitação SOS encontrada
              </div>
            ) : (
              <SosTable solicitacoes={solicitacoes.resultado} />
            )}
          </>
        )}
      </div>

      {solicitacoes && solicitacoes.totalPaginas > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Página {page} de {solicitacoes.totalPaginas}
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
              onClick={() => setPage((p) => Math.min(solicitacoes.totalPaginas, p + 1))}
              disabled={page >= solicitacoes.totalPaginas}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {solicitacoes && (
        <div className="text-sm text-muted-foreground text-right">
          {solicitacoes.resultado.length} solicitação(ões) SOS encontrada(s)
        </div>
      )}

      <NewSosModal
        open={newSosModalOpen}
        onOpenChange={setNewSosModalOpen}
        onSuccess={fetchSolicitacoes}
      />
    </div>
  );
}

function SosTable({ solicitacoes }: { solicitacoes: Readonly<Sos[]> }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold">Data</TableHead>
          <TableHead className="font-bold">Assistido</TableHead>
          {/* <TableHead className="font-bold">Motivo</TableHead> */}
          <TableHead className="font-bold">Itens</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {solicitacoes.map((sos) => (
          <SosRow key={sos.id} sos={sos} />
        ))}
      </TableBody>
    </Table>
  );
}

function SosRow({ sos }: { sos: Readonly<Sos> }) {
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
        <TableCell>{formatDate(sos.criadoEm)}</TableCell>
        <TableCell>
          <Badge variant="outline" className="font-normal">
            {sos.beneficiario || 'Não informado'}
          </Badge>
        </TableCell>
        {/* <TableCell>
          <span className="text-sm text-muted-foreground">{sos.motivo || 'Não informado'}</span>
        </TableCell> */}
        <TableCell className="flex items-center justify-between">
          <span>{sos.itens.length} item(ns)</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow className="border-t-0">
          <TableCell colSpan={4} className="p-0 pb-4">
            <div className="mx-4 mt-2 p-4 bg-card border rounded-md shadow-sm">
              <h4 className="font-semibold mb-3 text-lg text-center">Itens da solicitação SOS</h4>
              <div className="flex justify-center">
                <div className="w-full overflow-x-auto">
                  <Table className="w-full border">
                    <TableHeader>
                      <TableRow className="bg-primary/10">
                        <TableHead className="font-medium py-2 w-3/4">Produto</TableHead>
                        <TableHead className="font-medium text-center py-2 w-1/4">
                          Quantidade
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-accent/20">
                      {sos.itens.map((item) => (
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
