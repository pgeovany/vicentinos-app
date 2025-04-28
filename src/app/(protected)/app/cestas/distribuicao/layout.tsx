export default function CestasDistribuicaoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Distribuição de Cestas</h1>
      {children}
    </div>
  );
}
