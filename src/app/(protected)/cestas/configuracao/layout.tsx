export default function CestasConfiguracaoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configuração de cestas</h1>
      {children}
    </div>
  );
}
