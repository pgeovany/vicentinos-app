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
import { BeneficiarioNaListaResponse } from '@/api/beneficiarios/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/format-date';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function BeneficiariosLista() {
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioNaListaResponse[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBeneficiarios = async () => {
      setIsLoading(true);
      const response = await listarBeneficiarios({ quantidade: 100, pagina: 1 });

      if (response.success) {
        setBeneficiarios(response.data?.resultado ?? []);
      } else {
        toast.error(response.error);
      }
      setIsLoading(false);
    };

    fetchBeneficiarios();
  }, []);

  const filteredBeneficiarios = beneficiarios.filter((beneficiario) =>
    beneficiario.nome.toLowerCase().includes(filterValue.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="relative">
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
            className="hover:bg-accent/50 cursor-pointer"
            key={beneficiario.id}
            onClick={() => router.push(`/app/assistidos/${beneficiario.id}`)}
          >
            <TableCell className="py-3 px-4">{beneficiario.nome}</TableCell>
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
  );
}
