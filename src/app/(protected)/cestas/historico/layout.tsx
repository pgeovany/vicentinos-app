export default function CestasHistoricoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Histórico de distribuição de cestas</h1>
      {children}
    </div>
  );
}
