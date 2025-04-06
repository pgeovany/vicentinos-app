export default function SosListarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lista de S.O.S.</h1>
      {children}
    </div>
  );
}
