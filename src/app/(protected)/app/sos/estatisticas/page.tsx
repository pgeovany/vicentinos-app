import { EstatisticasSos } from './_components/EstatisticasSos';

export const metadata = {
  title: 'Estatísticas SOS',
  description: 'Estatísticas de distribuições SOS',
};

export default function EstatisticasSosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Estatísticas de assitências SOS</h1>
      </div>
      <EstatisticasSos />
    </div>
  );
}
