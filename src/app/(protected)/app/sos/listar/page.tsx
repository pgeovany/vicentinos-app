import { Metadata } from 'next';
import { SosLista } from './_components/SosLista';

export const metadata: Metadata = {
  title: 'SOS - Listagem',
  description: 'Listagem de solicitações SOS',
};

export default function SosListarPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Histórico de solicitações SOS</h1>
      </div>
      <SosLista />
    </div>
  );
}
