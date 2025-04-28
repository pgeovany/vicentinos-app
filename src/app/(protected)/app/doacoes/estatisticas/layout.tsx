export default function DoacoesEstatisticasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Estatísticas de doações</h1>
      {children}
    </div>
  );
}
