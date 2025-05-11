'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BeneficiarioComHistoricoResponse } from '@/api/beneficiarios/types';
import { criarBeneficiario, atualizarTipoCesta } from '../../actions';
import { renderOptionalField, renderOptionalDate } from '@/lib/render-optional-fields';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { ensureCorrectDate, toLocalIsoMidnight } from '@/lib/fix-date';
import { maskCPF, maskPhone, maskRG, stripMask } from '@/lib/masks';
import { EditCard } from './EditCard';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ENUM_ESTADO_CIVIL_BENEFICIARIO,
  ENUM_SEXO_BENEFICIARIO,
} from '@/api/beneficiarios/schemas';
import { ESTADO_CIVIL_MAP } from '@/lib/estado-civil.map';
import { listarTiposCestas } from '../../../cestas/actions';

interface PersonalInfoSectionProps {
  beneficiario: BeneficiarioComHistoricoResponse;
  beneficiarioId: string;
  onRefresh: () => void;
}

interface CestaTypeDialogProps {
  beneficiarioId: string;
  currentTipoCestaId?: string;
  onSuccess: () => void;
}

function CestaTypeDialog({ beneficiarioId, currentTipoCestaId, onSuccess }: CestaTypeDialogProps) {
  const [tipos, setTipos] = useState<Array<{ id: string; nome: string }>>([]);
  const [selectedTipoCestaId, setSelectedTipoCestaId] = useState<string>(currentTipoCestaId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTipos, setIsLoadingTipos] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTiposCesta = async () => {
      try {
        setIsLoadingTipos(true);
        const response = await listarTiposCestas();
        if (response.success && response.data) {
          setTipos(response.data.cestas);
        } else {
          toast.error('Erro ao carregar tipos de cestas');
        }
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar tipos de cestas');
      } finally {
        setIsLoadingTipos(false);
      }
    };

    if (isDialogOpen) {
      fetchTiposCesta();
    }
  }, [isDialogOpen]);

  const handleSaveTipoCesta = async () => {
    if (!selectedTipoCestaId) {
      toast.error('Selecione um tipo de cesta');
      return;
    }

    setIsLoading(true);
    const response = await atualizarTipoCesta({
      beneficiarioId,
      body: { tipoCestaId: selectedTipoCestaId },
    });

    if (response?.success) {
      toast.success('Tipo de cesta atualizado com sucesso');
      setIsDialogOpen(false);
      onSuccess();
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar tipo de cesta');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 ml-2"
          aria-label="Alterar tipo de cesta"
        >
          <PencilIcon className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Tipo de Cesta</DialogTitle>
          <DialogDescription>
            Escolha o tipo de cesta que este assistido deve receber.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="tipoCesta">Tipo de Cesta</Label>
            <Select
              value={selectedTipoCestaId}
              onValueChange={setSelectedTipoCestaId}
              disabled={isLoadingTipos}
            >
              <SelectTrigger id="tipoCesta" className="w-full cursor-pointer">
                <SelectValue
                  placeholder={isLoadingTipos ? 'Carregando...' : 'Selecione o tipo de cesta'}
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTipos ? (
                  <SelectItem value="loading" disabled>
                    Carregando tipos de cestas...
                  </SelectItem>
                ) : (
                  tipos.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSaveTipoCesta}
            disabled={isLoading || isLoadingTipos}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PersonalInfoSection({
  beneficiario,
  beneficiarioId,
  onRefresh,
}: PersonalInfoSectionProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: beneficiario.nome || '',
    cpf: beneficiario.cpf || '',
    rg: beneficiario.rg || '',
    telefone: beneficiario.telefone || '',
    sexo: beneficiario.sexo || '',
    estadoCivil: beneficiario.estadoCivil || '',
    profissao: beneficiario.profissao || '',
    rendaMensal: beneficiario.rendaMensal || '',
    pessoaComDeficiencia: beneficiario.pessoaComDeficiencia || false,
    dataNascimento: ensureCorrectDate(beneficiario.dataNascimento ?? ''),
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nome: beneficiario.nome || '',
      cpf: beneficiario.cpf || '',
      rg: beneficiario.rg || '',
      telefone: beneficiario.telefone || '',
      sexo: beneficiario.sexo || '',
      estadoCivil: beneficiario.estadoCivil || '',
      profissao: beneficiario.profissao || '',
      rendaMensal: beneficiario.rendaMensal || '',
      pessoaComDeficiencia: beneficiario.pessoaComDeficiencia || false,
      dataNascimento: ensureCorrectDate(beneficiario.dataNascimento ?? ''),
    });
  };

  const handleSave = async () => {
    const response = await criarBeneficiario({
      beneficiarioId: beneficiarioId,
      nome: formData.nome,
      cpf: stripMask(formData.cpf) || undefined,
      rg: stripMask(formData.rg) || undefined,
      sexo: (formData.sexo as ENUM_SEXO_BENEFICIARIO) || undefined,
      estadoCivil: (formData.estadoCivil as ENUM_ESTADO_CIVIL_BENEFICIARIO) || undefined,
      profissao: formData.profissao || undefined,
      rendaMensal: formData.rendaMensal || undefined,
      pessoaComDeficiencia: formData.pessoaComDeficiencia,
      dataNascimento: formData.dataNascimento
        ? toLocalIsoMidnight(formData.dataNascimento)
        : undefined,
      telefone: stripMask(formData.telefone) || undefined,
    });

    if (response?.success) {
      toast.success('Dados pessoais atualizados com sucesso');
      onRefresh();
      setEditing(false);
    } else {
      toast.error(response?.error ?? 'Erro ao atualizar dados pessoais');
    }
  };

  return (
    <EditCard
      title="Informações Pessoais"
      isEditing={editing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!editing ? (
        <div className="grid grid-cols-2 gap-4">
          {renderOptionalField(beneficiario.nome, 'Nome')}
          {renderOptionalField(maskCPF(beneficiario.cpf ?? ''), 'CPF')}
          {renderOptionalField(maskRG(beneficiario.rg ?? ''), 'RG')}
          {renderOptionalDate(beneficiario.dataNascimento, 'Data de Nascimento')}
          {renderOptionalField(beneficiario.sexo, 'Sexo')}
          {renderOptionalField(
            ESTADO_CIVIL_MAP[beneficiario.estadoCivil as ENUM_ESTADO_CIVIL_BENEFICIARIO] ?? '',
            'Estado Civil',
          )}
          {renderOptionalField(beneficiario.profissao, 'Profissão')}
          {renderOptionalField(beneficiario.rendaMensal, 'Renda Mensal')}
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Pessoa com Deficiência</span>
            <div className="flex items-center space-x-2">
              <Switch
                className="cursor-pointer"
                checked={beneficiario.pessoaComDeficiencia}
                disabled
              />
              <Label>{beneficiario.pessoaComDeficiencia ? 'Sim' : 'Não'}</Label>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Status</span>
            <div className="flex items-center space-x-2">
              <Label>{beneficiario.status?.toLowerCase()}</Label>
            </div>
          </div>
          {renderOptionalField(maskPhone(beneficiario.telefone ?? ''), 'Telefone')}
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Tipo de Cesta</span>
            <div className="flex items-center">
              <span className="text-sm">{beneficiario.tipoCesta?.nome || 'Não definido'}</span>
              <CestaTypeDialog
                beneficiarioId={beneficiarioId}
                currentTipoCestaId={beneficiario.tipoCesta?.id}
                onSuccess={onRefresh}
              />
            </div>
          </div>
          {renderOptionalDate(beneficiario.criadoEm, 'Cadastrado em')}
          {renderOptionalDate(beneficiario.atualizadoEm, 'Última atualização')}
          {renderOptionalDate(beneficiario.efetivadoEm, 'Efetivado em')}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                maxLength={14}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => setFormData({ ...formData, rg: maskRG(e.target.value) })}
                maxLength={12}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-nascimento">Data de nascimento</Label>
              <CustomDatePicker
                id="data-nascimento"
                date={formData.dataNascimento ? new Date(formData.dataNascimento) : undefined}
                onSelect={(date) =>
                  setFormData({
                    ...formData,
                    dataNascimento: date ? date.toISOString().split('T')[0] : '',
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={formData.sexo}
                onValueChange={(value) => setFormData({ ...formData, sexo: value })}
              >
                <SelectTrigger id="sexo" className="cursor-pointer">
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select
                value={formData.estadoCivil}
                onValueChange={(value) => setFormData({ ...formData, estadoCivil: value })}
              >
                <SelectTrigger id="estadoCivil" className="cursor-pointer">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                  <SelectItem value="CASADO">Casado(a)</SelectItem>
                  <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                  <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                  <SelectItem value="SEPARADO">Separado(a)</SelectItem>
                  <SelectItem value="UNIAO_ESTAVEL">União Estável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={formData.profissao}
                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rendaMensal">Renda Mensal</Label>
              <Select
                value={formData.rendaMensal}
                onValueChange={(value) => setFormData({ ...formData, rendaMensal: value })}
              >
                <SelectTrigger id="rendaMensal">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'Sem renda'}>Sem renda</SelectItem>
                  <SelectItem value={'Até 1 salário mínimo'}>Até 1 salário mínimo</SelectItem>
                  <SelectItem value={'Até 2 salários mínimos'}>Até 2 salários mínimos</SelectItem>
                  <SelectItem value={'Até 3 salários mínimos'}>Até 3 salários mínimos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pessoaComDeficiencia">Pessoa com Deficiência</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="pessoaComDeficiencia"
                  checked={formData.pessoaComDeficiencia}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, pessoaComDeficiencia: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="pessoaComDeficiencia">
                  {formData.pessoaComDeficiencia ? 'Sim' : 'Não'}
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
                maxLength={15}
              />
            </div>
          </div>
        </div>
      )}
    </EditCard>
  );
}
