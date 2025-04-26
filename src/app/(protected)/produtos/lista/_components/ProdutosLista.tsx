'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarProdutos, cadastrarProduto } from '../../actions';
import { ProdutoComEstoque } from '@/api/produtos/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CriarProdutoDto, CriarProdutoSchema } from '@/api/produtos/schemas';

export function ProdutosLista() {
  const [produtos, setProdutos] = useState<ProdutoComEstoque[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProdutos = async () => {
    setIsLoading(true);
    const response = await listarProdutos({ quantidade: '100', pagina: '1' });

    if (response.success) {
      setProdutos(response.data?.resultado ?? []);
    } else {
      toast.error(response.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(filterValue.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtrar por nome..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="pl-8"
          />
        </div>

        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="border rounded-md p-2">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando produtos...</div>
        ) : (
          <>
            {filteredProdutos.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhum produto encontrado
              </div>
            ) : (
              <ProdutoTable produtos={filteredProdutos} />
            )}
          </>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-right">
        {filteredProdutos.length} produto(s) encontrado(s)
      </div>

      <NovoProdutoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {
          fetchProdutos();
        }}
      />
    </div>
  );
}

function ProdutoTable({
  produtos,
}: Readonly<{
  produtos: ProdutoComEstoque[];
}>) {
  return (
    <Table className="border-collapse">
      <TableHeader>
        <TableRow className="bg-accent">
          <TableHead className="font-bold py-3 px-4">Nome</TableHead>
          <TableHead className="font-bold py-3 px-4 text-center">Quantidade em estoque</TableHead>
          {/* <TableHead className="font-bold">Status</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtos.map((produto) => (
          <TableRow className="hover:bg-accent/50" key={produto.id}>
            <TableCell className="py-3 px-4">{produto.nome}</TableCell>
            <TableCell className="py-3 px-4 text-center">
              {produto.estoque?.quantidade || 0}
            </TableCell>
            {/* <TableCell>{produto.status.toLowerCase()}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function NovoProdutoModal({
  open,
  onOpenChange,
  onSuccess,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CriarProdutoDto>({
    resolver: zodResolver(CriarProdutoSchema),
    defaultValues: {
      nome: '',
    },
  });

  const onSubmit = async (data: CriarProdutoDto) => {
    setIsSubmitting(true);
    try {
      const response = await cadastrarProduto(data);
      if (response.success) {
        toast.success('Produto cadastrado com sucesso!');
        reset();
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(response.error || 'Erro ao cadastrar produto');
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error('Erro ao cadastrar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo Produto</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2 px-4">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Nome do produto"
              {...register('nome')}
              className={errors.nome ? 'border-red-500' : ''}
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
          </div>
          <SheetFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
