'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Cesta } from '@/api/cestas/types';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Package2 } from 'lucide-react';
import { listarTiposCestas } from '@/app/(protected)/app/cestas/actions';

interface CestaTypeStepProps {
  tipoCestaId: string;
  updateTipoCestaId: (tipoCestaId: string) => void;
}

export function CestaTypeStep({ tipoCestaId, updateTipoCestaId }: CestaTypeStepProps) {
  const [tipos, setTipos] = useState<Cesta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiposCesta = async () => {
      try {
        const response = await listarTiposCestas();

        if (!response.success) {
          throw new Error('Erro ao buscar tipos de cestas');
        }

        setTipos(response.data!.cestas || []);
      } catch (error) {
        console.error('Error fetching tipos cesta:', error);
        toast.error('Não foi possível carregar os tipos de cestas');
      } finally {
        setLoading(false);
      }
    };

    fetchTiposCesta();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p>Carregando tipos de cestas...</p>
      </div>
    );
  }

  if (tipos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum tipo de cesta encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          Campos com <span className="text-destructive">*</span> são obrigatórios
        </p>
      </div>
      <div>
        <Label>
          Selecione o tipo de cesta <span className="text-destructive">*</span>
        </Label>

        <RadioGroup
          value={tipoCestaId}
          onValueChange={updateTipoCestaId}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
        >
          {tipos.map((tipo) => (
            <div key={tipo.id} className="relative">
              <RadioGroupItem
                value={tipo.id}
                id={`cesta-${tipo.id}`}
                className="absolute top-4 left-4 z-10"
              />
              <Label htmlFor={`cesta-${tipo.id}`} className="cursor-pointer block h-full">
                <Card
                  className={`h-full transition-colors ${tipoCestaId === tipo.id ? 'border-primary' : ''}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{tipo.nome}</CardTitle>
                        {tipo.descricao && <CardDescription>{tipo.descricao}</CardDescription>}
                      </div>
                      <Package2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    {/* {tipo.produtos && tipo.produtos.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Conteúdo da cesta:</p>
                        <ul className="text-sm text-muted-foreground">
                          {tipo.produtos.map((produto) => (
                            <li key={produto.id} className="flex justify-between mb-1">
                              <span>{produto.nome}</span>
                              <span>{produto.quantidade}x</span>
                            </li>
                          ))}
                        </ul> 
                      </div>
                    )} */}
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
