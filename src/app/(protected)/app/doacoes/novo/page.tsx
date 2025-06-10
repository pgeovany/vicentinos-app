import { NovaDoacao } from './_components/NovaDoacao';

export default function NovaDoacaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registrar nova doação</h1>
        <p className="text-muted-foreground">
          Todos os produtos estão pré-selecionados. Remova os que não foram doados e ajuste as
          quantidades.
        </p>
      </div>
      <NovaDoacao />
    </div>
  );
}
