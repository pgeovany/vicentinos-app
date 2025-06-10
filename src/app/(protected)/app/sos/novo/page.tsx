import { CriarSos } from './_components/CriarSos';

export default function NovoSosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registrar novo SOS</h1>
        <p className="text-muted-foreground">
          Todos os produtos estão pré-selecionados. Remova os que não precisar e ajuste as
          quantidades.
        </p>
      </div>
      <CriarSos />
    </div>
  );
}
