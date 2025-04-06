export default function SosEstatisticasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Estatísticas de S.O.S.</h1>
      {children}
    </div>
  );
}
