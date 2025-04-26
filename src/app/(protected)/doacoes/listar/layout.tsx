export default function DoacoesListarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lista de doações recebidas</h1>
      {children}
    </div>
  );
}
