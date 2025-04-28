'use client';

import { RemocaoDiretaEstoqueSchema } from '@/api/estoque/schemas';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { removerEstoqueProdutoDiretamente } from '../../actions';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { generateQuantityOptions } from '@/lib/generate-select-quantity';

const formSchema = RemocaoDiretaEstoqueSchema;
type FormValues = z.infer<typeof formSchema>;

type RemoverProdutoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto: {
    id: string;
    nome: string;
    quantidadeDisponivel: number;
  };
  onSuccess: () => void;
};

export function RemoverProdutoDialog({
  open,
  onOpenChange,
  produto,
  onSuccess,
}: RemoverProdutoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(false);

  const maxQuantity = Math.min(20, produto.quantidadeDisponivel);
  const quantityOptions = generateQuantityOptions(maxQuantity);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produtoId: produto.id,
      quantidade: 1,
      motivo: undefined,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      const response = await removerEstoqueProdutoDiretamente(values);

      if (response.success) {
        toast.success('Produto removido do estoque com sucesso');
        onOpenChange(false);
        onSuccess();
        resetForm();
      } else {
        toast.error(response.error || 'Erro ao remover produto do estoque');
      }
    } catch {
      toast.error('Erro ao remover produto do estoque');
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    form.reset();
    setConfirmationStep(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Remover produto do estoque
              </DialogTitle>
              <DialogDescription className="text-red-500 font-semibold pt-2">
                ATENÇÃO: Esta ação é para casos excepcionais como produtos que expiraram ou foram
                danificados. Não use para saídas normais de estoque.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <h3 className="font-medium">Produto:</h3>
                <p>{produto.nome}</p>
              </div>

              <div>
                <h3 className="font-medium">Quantidade disponível:</h3>
                <p>{produto.quantidadeDisponivel}</p>
              </div>

              {!confirmationStep ? (
                <>
                  <FormField
                    control={form.control}
                    name="motivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo da remoção</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o motivo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Vencido">Vencido</SelectItem>
                              <SelectItem value="Danificado">Danificado</SelectItem>
                              <SelectItem value="Avariado">Avariado</SelectItem>
                              <SelectItem value="Contaminado">Contaminado</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade a remover</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                            defaultValue="1"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a quantidade" />
                            </SelectTrigger>
                            <SelectContent>
                              {quantityOptions.map((qty) => (
                                <SelectItem key={qty} value={qty.toString()}>
                                  {qty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <p className="text-yellow-800 text-sm">
                      {`Esta ação não pode ser desfeita. Para continuar, clique em "Prosseguir"`}.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-red-50 p-4 rounded-md border border-red-200">
                  <p className="text-red-800 text-sm font-medium">
                    Você está prestes a remover permanentemente {form.getValues().quantidade}{' '}
                    unidade(s) do produto &quot;{produto.nome}&quot; do estoque por motivo de &quot;
                    {form.getValues().motivo?.toLowerCase()}&quot;.
                  </p>
                  <p className="text-red-800 text-sm mt-2">Confirma esta ação?</p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              {!confirmationStep ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    type="button"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    type="button"
                    disabled={isSubmitting || !form.formState.isValid}
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmationStep(true);
                    }}
                  >
                    Prosseguir
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmationStep(false);
                    }}
                    type="button"
                    disabled={isSubmitting}
                  >
                    Voltar
                  </Button>
                  <Button variant="destructive" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processando...' : 'Confirmar remoção'}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
