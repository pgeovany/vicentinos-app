export default function CadastroBeneficiarioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cadastro de Beneficiário</h1>
      {children}
    </div>
  );
}
