'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarDistribuicoesCestasPendentes, entregarCesta } from '../../actions';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BeneficiarioDistribuicao } from '@/api/cestas/types';

export function DistribuicaoCestas() {
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioDistribuicao[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');
  const [processando, setProcessando] = useState(false);

  const fetchDistribuicoes = async () => {
    setIsLoading(true);
    const response = await listarDistribuicoesCestasPendentes({
      quantidade: '100',
      pagina: '1',
    });

    if (response.success) {
      setBeneficiarios(response.data?.beneficiarios ?? []);
    } else {
      toast.error(response.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDistribuicoes();

    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const currentDate = new Date();

    setCurrentMonth(monthNames[currentDate.getMonth()]);
  }, []);

  const filteredBeneficiarios = beneficiarios.filter((beneficiario) =>
    beneficiario.nome.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const handleSelectBeneficiario = (id: string) => {
    if (selectedBeneficiario === id) {
      setSelectedBeneficiario(null);
    } else {
      setSelectedBeneficiario(id);
    }
  };

  const handleEntregarCesta = async () => {
    if (!selectedBeneficiario) {
      toast.error('Selecione um beneficiário');
      return;
    }

    setConfirmDialogOpen(true);
  };

  const confirmEntrega = async () => {
    if (!selectedBeneficiario) return;

    setProcessando(true);

    try {
      const beneficiarioSelecionado = beneficiarios.find((b) => b.id === selectedBeneficiario);
      const response = await entregarCesta(selectedBeneficiario);

      if (response.success) {
        toast.success(`Cesta entregue com sucesso para ${beneficiarioSelecionado?.nome}!`);
        setSelectedBeneficiario(null);
        fetchDistribuicoes();
      } else {
        toast.error(`Erro ao entregar cesta: ${response.error}`);
      }
    } catch (error) {
      console.error('Erro ao entregar cesta:', error);
      toast.error('Ocorreu um erro ao entregar a cesta');
    } finally {
      setConfirmDialogOpen(false);
      setProcessando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Distribuições do mês de {currentMonth} ({beneficiarios.length} beneficiarios restantes)
        </h2>
        <Button
          onClick={handleEntregarCesta}
          disabled={!selectedBeneficiario}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="mr-2 h-4 w-4" />
          Confirmar Entrega
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrar por nome..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="border rounded-md p-2">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando beneficiários...</div>
        ) : (
          <>
            {filteredBeneficiarios.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Nenhum beneficiário pendente para receber cesta neste mês!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="font-bold">Nome</TableHead>
                    <TableHead className="font-bold">Tipo de Cesta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeneficiarios.map((beneficiario) => (
                    <TableRow
                      className={`hover:bg-accent/50 cursor-pointer ${
                        selectedBeneficiario === beneficiario.id ? 'bg-green-50' : ''
                      }`}
                      key={beneficiario.id}
                      onClick={() => handleSelectBeneficiario(beneficiario.id)}
                    >
                      <TableCell>
                        <div className="flex items-center justify-center h-5">
                          <input
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            checked={selectedBeneficiario === beneficiario.id}
                            onChange={() => {}}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{beneficiario.nome}</TableCell>
                      <TableCell>{beneficiario.tipoCesta.nome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-right">
        {filteredBeneficiarios.length} beneficiário(s) pendente(s) para receber cesta
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar entrega de cesta</DialogTitle>
            <DialogDescription>
              {selectedBeneficiario && (
                <>
                  Você está prestes a confirmar a entrega de uma cesta para{' '}
                  <strong>{beneficiarios.find((b) => b.id === selectedBeneficiario)?.nome}</strong>.
                  Esta ação não pode ser desfeita.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={processando}
            >
              Cancelar
            </Button>
            <Button onClick={confirmEntrega} disabled={processando}>
              {processando ? 'Processando...' : 'Confirmar Entrega'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
