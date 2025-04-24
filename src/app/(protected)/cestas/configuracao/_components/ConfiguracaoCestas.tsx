'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Cesta } from '@/api/cestas/types';
import { Plus } from 'lucide-react';
import { listarTiposCestas, removerProdutoCesta } from '../../actions';
import { CreateCestaModal } from './CreateCestaModal';
import { AddProductModal } from './AddProductModal';
import { CestaCard } from './CestaCard';
import { ConfirmRemoveDialog } from './ConfirmRemoveDialog';
import { generateQuantityOptions } from '@/lib/generate-select-quantity';

export function ConfiguracaoCestas() {
  const [cestas, setCestas] = useState<Cesta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [expandedCestaId, setExpandedCestaId] = useState<string | null>(null);
  const [addProductModalOpen, setAddProductModalOpen] = useState<{
    isOpen: boolean;
    cestaId: string | null;
  }>({
    isOpen: false,
    cestaId: null,
  });
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState<{
    cestaId: string;
    produtoId: string;
    productName: string;
  } | null>(null);

  const fetchCestas = async () => {
    setIsLoading(true);
    const response = await listarTiposCestas();

    if (response.success) {
      setCestas(response.data?.cestas || []);
    } else {
      toast.error(response.error || 'Erro ao carregar tipos de cestas');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCestas();
  }, []);

  const toggleExpand = (cestaId: string) => {
    setExpandedCestaId(expandedCestaId === cestaId ? null : cestaId);
  };

  const handleOpenAddProduct = (cestaId: string) => {
    setAddProductModalOpen({ isOpen: true, cestaId });
  };

  const confirmRemoveProduct = (cestaId: string, produtoId: string, productName: string) => {
    setProductToRemove({ cestaId, produtoId, productName });
    setConfirmRemoveOpen(true);
  };

  const handleRemoveProduct = async () => {
    if (!productToRemove) return;

    try {
      const response = await removerProdutoCesta({
        cestaId: productToRemove.cestaId,
        produtoId: productToRemove.produtoId,
      });

      if (response.success) {
        toast.success('Produto removido com sucesso');
        fetchCestas();
      } else {
        toast.error(response.error || 'Erro ao remover produto');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao remover produto');
    } finally {
      setConfirmRemoveOpen(false);
      setProductToRemove(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tipos de cestas cadastradas</h2>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Cesta
        </Button>
      </div>

      <div className="border rounded-md p-2">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando cestas...</div>
        ) : (
          <>
            {cestas.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">Nenhuma cesta cadastrada</div>
            ) : (
              <div className="space-y-4">
                {cestas.map((cesta) => (
                  <CestaCard
                    key={cesta.id}
                    cesta={cesta}
                    isExpanded={expandedCestaId === cesta.id}
                    expandedCestaId={expandedCestaId}
                    onToggleExpand={toggleExpand}
                    onOpenAddProduct={handleOpenAddProduct}
                    onConfirmRemoveProduct={confirmRemoveProduct}
                    generateQuantityOptions={generateQuantityOptions}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateCestaModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchCestas}
      />

      <AddProductModal
        open={addProductModalOpen.isOpen}
        cestaId={addProductModalOpen.cestaId}
        cestas={cestas}
        onOpenChange={(open) =>
          setAddProductModalOpen({ isOpen: open, cestaId: addProductModalOpen.cestaId })
        }
        onSuccess={fetchCestas}
      />

      <ConfirmRemoveDialog
        open={confirmRemoveOpen}
        onOpenChange={setConfirmRemoveOpen}
        productToRemove={productToRemove}
        onConfirm={handleRemoveProduct}
      />
    </div>
  );
}
