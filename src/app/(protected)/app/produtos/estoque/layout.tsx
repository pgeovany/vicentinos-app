export default function ProdutosEstoqueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Estoque de produtos</h1>
      {children}
    </div>
  );
}
