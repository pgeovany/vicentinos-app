'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { desligarBeneficiario, reativarBeneficiario } from '../../actions';

interface StatusActionsProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => Promise<void>;
}

export function StatusActions({ beneficiario, beneficiarioId, onRefresh }: StatusActionsProps) {
  const [showDesligarModal, setShowDesligarModal] = useState(false);
  const [showConfirmDesligarModal, setShowConfirmDesligarModal] = useState(false);
  const [showConfirmReativarModal, setShowConfirmReativarModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const isInactive = beneficiario.status === 'INATIVO';

  const handleDesligar = async () => {
    setIsLoading(true);
    const motivo = selectedReason === 'Outro' ? customReason : selectedReason;

    const response = await desligarBeneficiario({
      beneficiarioId,
      body: { motivo },
    });

    setIsLoading(false);

    if (response?.success) {
      toast.success('Assistido desligado com sucesso');
      setShowConfirmDesligarModal(false);
      onRefresh();
    } else {
      toast.error(response?.error ?? 'Erro ao desligar assistido');
    }
  };

  const handleReativar = async () => {
    setIsLoading(true);

    const response = await reativarBeneficiario(beneficiarioId);

    setIsLoading(false);

    if (response?.success) {
      toast.success('Assistido reativado com sucesso');
      setShowConfirmReativarModal(false);
      onRefresh();
    } else {
      toast.error(response?.error ?? 'Erro ao reativar assistido');
    }
  };

  const openDesligarModal = () => {
    setSelectedReason('');
    setCustomReason('');
    setShowDesligarModal(true);
  };

  const handleReasonSelected = () => {
    if (!selectedReason) {
      toast.error('Escolha um motivo para desligar o assistido');
      return;
    }

    if (selectedReason === 'Outro' && !customReason) {
      toast.error('Insira um motivo personalizado');
      return;
    }

    setShowDesligarModal(false);
    setShowConfirmDesligarModal(true);
  };

  return (
    <div className="flex gap-2 mt-4">
      {!isInactive ? (
        <Button variant="destructive" onClick={openDesligarModal}>
          Desligar Assistido
        </Button>
      ) : (
        <Button variant="default" onClick={() => setShowConfirmReativarModal(true)}>
          Reativar Assistido
        </Button>
      )}

      {/* Modal para escolher o motivo do desligamento */}
      <Dialog open={showDesligarModal} onOpenChange={setShowDesligarModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desligar Assistido</DialogTitle>
            <DialogDescription>Escolha o motivo do desligamento do assistido.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Select onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Empregabilidade">Empregabilidade</SelectItem>
                  <SelectItem value="Ausência">Ausência</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedReason === 'Outro' && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Motivo Personalizado</Label>
                <Input
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Digite o motivo"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDesligarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReasonSelected}>Avançar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de desligamento */}
      <AlertDialog open={showConfirmDesligarModal} onOpenChange={setShowConfirmDesligarModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desligamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desligar este assistido? Esta ação pode ser revertida
              posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDesligar} disabled={isLoading}>
              {isLoading ? 'Processando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de confirmação de reativação */}
      <AlertDialog open={showConfirmReativarModal} onOpenChange={setShowConfirmReativarModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reativar este assistido?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReativar} disabled={isLoading}>
              {isLoading ? 'Processando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
