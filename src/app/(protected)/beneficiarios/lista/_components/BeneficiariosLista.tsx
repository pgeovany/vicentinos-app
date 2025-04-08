'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarBeneficiarios } from '../actions';
import { BeneficiarioResponse } from '@/api/beneficiarios/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/format-date';
import { useRouter } from 'next/navigation';

export function BeneficiariosLista() {
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioResponse[]>(
    []
  );

  useEffect(() => {
    const fetchBeneficiarios = async () => {
      const response = await listarBeneficiarios({});

      if (response.success) {
        setBeneficiarios(response.data?.resultado ?? []);
      } else {
        toast.error(response.error);
      }
    };

    fetchBeneficiarios();
  }, []);

  return (
    <div className="border rounded-md p-2">
      <BeneficiarioTable beneficiarios={beneficiarios} />
    </div>
  );
}

function BeneficiarioTable({
  beneficiarios,
}: Readonly<{
  beneficiarios: BeneficiarioResponse[];
}>) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold">Nome</TableHead>
          <TableHead className="font-bold">Status</TableHead>
          <TableHead className="font-bold">Tipo de cesta</TableHead>
          <TableHead className="font-bold">Data de cadastro</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {beneficiarios.map((beneficiario) => (
          <TableRow
            className="hover:bg-accent/50 cursor-pointer"
            key={beneficiario.id}
            onClick={() => router.push(`/beneficiarios/${beneficiario.id}`)}
          >
            <TableCell>{beneficiario.nome}</TableCell>
            <TableCell>{beneficiario.status.toLowerCase()}</TableCell>
            <TableCell>{beneficiario.tipoCesta.nome}</TableCell>
            <TableCell>{formatDate(beneficiario.criadoEm)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
