'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { criarCesta } from '../../actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CriarCestaSchema } from '@/api/cestas/schemas';
import { z } from 'zod';
import { toast } from 'sonner';

export type CestaFormValues = z.infer<typeof CriarCestaSchema>;

interface CreateCestaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCestaModal({ open, onOpenChange, onSuccess }: CreateCestaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CestaFormValues>({
    resolver: zodResolver(CriarCestaSchema),
    defaultValues: {
      nome: '',
      descricao: '',
    },
  });

  const onSubmit = async (data: CestaFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await criarCesta(data);

      if (response.success) {
        toast.success('Cesta criada com sucesso!');
        reset();
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(response.error || 'Erro ao criar cesta');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar cesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nova Cesta</SheetTitle>
          <SheetDescription>Crie um novo tipo de cesta para distribuição</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2 px-4">
            <Label htmlFor="nome">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              placeholder="Nome da cesta"
              {...register('nome')}
              className={errors.nome ? 'border-red-500' : ''}
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="space-y-2 px-4">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Descrição da cesta"
              {...register('descricao')}
              className={errors.descricao ? 'border-red-500' : ''}
            />
            {errors.descricao && <p className="text-sm text-red-500">{errors.descricao.message}</p>}
          </div>

          <SheetFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Cesta'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
