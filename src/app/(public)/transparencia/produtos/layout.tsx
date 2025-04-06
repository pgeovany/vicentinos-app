export default function TransparenciaProdutosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Produtos mais necessitados</h1>
      {children}
    </div>
  );
}
