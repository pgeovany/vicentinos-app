export default function ProdutosMovimentacoesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Histórico de movimentações de produtos
      </h1>
      {children}
    </div>
  );
}
