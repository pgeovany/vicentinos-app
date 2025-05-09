'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarBeneficiarios } from '../../actions';
import { listarTiposCestas } from '@/app/(protected)/app/cestas/actions';
import { BeneficiarioNaListaResponse } from '@/api/beneficiarios/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/format-date';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ENUM_STATUS_BENEFICIARIO, ListarBeneficiariosDto } from '@/api/beneficiarios/schemas';

type StatusFilter = ENUM_STATUS_BENEFICIARIO | 'TODOS';

export function BeneficiariosLista() {
  const [allBeneficiarios, setAllBeneficiarios] = useState<BeneficiarioNaListaResponse[]>([]);
  const [filterName, setFilterName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>(
    ENUM_STATUS_BENEFICIARIO.ATIVO,
  );
  const [selectedTipoCesta, setSelectedTipoCesta] = useState('');
  const [tiposCesta, setTiposCesta] = useState<Array<{ id: string; nome: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTiposCesta, setIsLoadingTiposCesta] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveAdvancedFilters =
    selectedTipoCesta !== '' || selectedStatus !== ENUM_STATUS_BENEFICIARIO.ATIVO;

  const fetchBeneficiarios = async () => {
    setIsLoading(true);

    const params: Partial<ListarBeneficiariosDto> = {
      quantidade: 1000,
      pagina: 1,
    };

    if (selectedStatus && selectedStatus !== 'TODOS') {
      params.status = selectedStatus;
    }

    if (selectedTipoCesta && selectedTipoCesta !== 'all') {
      params.tipoCestaId = selectedTipoCesta;
    }

    const response = await listarBeneficiarios(params);

    if (response.success) {
      setAllBeneficiarios(response.data?.resultado ?? []);
    } else {
      toast.error(response.error);
    }
    setIsLoading(false);
  };

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
    fetchBeneficiarios();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBeneficiarios();
  };

  const handleClearFilters = () => {
    setSelectedStatus(ENUM_STATUS_BENEFICIARIO.ATIVO);
    setSelectedTipoCesta('');

    setTimeout(() => {
      fetchBeneficiarios();
    }, 0);
  };

  // Client-side filtering for search
  const filteredBeneficiarios = allBeneficiarios.filter((beneficiario) =>
    beneficiario.nome.toLowerCase().includes(filterName.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="text-xs flex items-center gap-1"
        >
          <Filter className="h-3.5 w-3.5" />
          Filtros avançados
          {showAdvancedFilters ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>

        {hasActiveAdvancedFilters && (
          <div className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
            Filtros avançados ativos
          </div>
        )}
      </div>

      {showAdvancedFilters && (
        <Card className="p-4">
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value: StatusFilter) => setSelectedStatus(value)}
                >
                  <SelectTrigger id="status" className="w-full cursor-pointer">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ENUM_STATUS_BENEFICIARIO.ATIVO}>Ativos</SelectItem>
                    <SelectItem value={ENUM_STATUS_BENEFICIARIO.INATIVO}>Desligados</SelectItem>
                    <SelectItem value="TODOS">Todos</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                disabled={!hasActiveAdvancedFilters}
              >
                Limpar Filtros
              </Button>
              <Button type="submit">Aplicar Filtros</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar assistidos por nome..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="border rounded-md p-2">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando assistidos...</div>
        ) : (
          <>
            {filteredBeneficiarios.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhum assistido encontrado
              </div>
            ) : (
              <BeneficiarioTable beneficiarios={filteredBeneficiarios} />
            )}
          </>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-right">
        {filteredBeneficiarios.length} assistido(s) encontrado(s)
      </div>
    </div>
  );
}

function BeneficiarioTable({
  beneficiarios,
}: Readonly<{
  beneficiarios: BeneficiarioNaListaResponse[];
}>) {
  const router = useRouter();

  return (
    <>
      <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
        <ExternalLink className="h-3.5 w-3.5" />
        Clique em um assistido para ver os detalhes
      </div>
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="bg-accent">
            <TableHead className="font-bold py-3 px-4">Nome</TableHead>
            <TableHead className="font-bold py-3 px-4 text-center">Cesta</TableHead>
            <TableHead className="font-bold py-3 px-4 text-center">Status</TableHead>
            <TableHead className="font-bold py-3 px-4 text-center">Data de efetivação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {beneficiarios.map((beneficiario) => (
            <TableRow
              className="hover:bg-accent/50 cursor-pointer group"
              key={beneficiario.id}
              onClick={() => router.push(`/app/assistidos/${beneficiario.id}`)}
            >
              <TableCell className="py-3 px-4 flex items-center gap-1">
                {beneficiario.nome}
                <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableCell>
              <TableCell className="py-3 px-4 text-center">
                {beneficiario.tipoCesta?.nome ?? '--'}
              </TableCell>
              <TableCell className="py-3 px-4 text-center">
                {beneficiario.status.toLowerCase()}
              </TableCell>
              <TableCell className="py-3 px-4 text-center">
                {formatDate(beneficiario.efetivadoEm)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
