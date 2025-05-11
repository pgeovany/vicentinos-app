'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  UserRound,
  MapPin,
  Users,
  Package,
  AlertTriangle,
  Heart,
  CircleDollarSign,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonalInfoStep } from './PersonalInfoStep';
import { AddressStep } from './AddressStep';
import { BenefitsStep } from './BenefitsStep';
import { HealthStep } from './HealthStep';
import { InterestsStep } from './InterestsStep';
import { DependentsStep } from './DependentsStep';
import { CestaTypeStep } from './CestaTypeStep';
import { toast } from 'sonner';
import {
  criarBeneficiario,
  atualizarEndereco,
  atualizarBeneficiosSociais,
  atualizarSaude,
  atualizarInteresses,
  adicionarDependentes,
  atualizarTipoCesta,
} from '../../actions';
import { toLocalIsoMidnight } from '@/lib/fix-date';
import { stripMask } from '@/lib/masks';
import { Separator } from '@/components/ui/separator';
import { BeneficiarioFormData } from '../types';
import {
  ENUM_ESTADO_CIVIL_BENEFICIARIO,
  ENUM_SEXO_BENEFICIARIO,
  ENUM_TIPO_MORADIA_BENEFICIARIO,
} from '@/api/beneficiarios/schemas';

interface BeneficiarioRegisterFormProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 'personal-info',
    title: 'Informações Pessoais',
    icon: UserRound,
    description: 'Dados pessoais do assistido',
  },
  {
    id: 'address',
    title: 'Endereço',
    icon: MapPin,
    description: 'Endereço de residência',
  },
  {
    id: 'benefits',
    title: 'Benefícios Sociais',
    icon: CircleDollarSign,
    description: 'Benefícios sociais recebidos',
  },
  {
    id: 'health',
    title: 'Saúde',
    icon: Heart,
    description: 'Informações de saúde',
  },
  {
    id: 'interests',
    title: 'Interesses',
    icon: Lightbulb,
    description: 'Interesses em cursos e palestras',
  },
  {
    id: 'dependents',
    title: 'Dependentes',
    icon: Users,
    description: 'Cadastro de dependentes',
  },
  {
    id: 'cesta-type',
    title: 'Tipo de Cesta',
    icon: Package,
    description: 'Tipo de cesta a receber',
  },
];

export function BeneficiarioRegisterForm({ onComplete }: BeneficiarioRegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [beneficiarioId, setBeneficiarioId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BeneficiarioFormData>({
    // Personal info
    nome: '',
    cpf: '',
    rg: '',
    sexo: '',
    dataNascimento: '',
    telefone: '',
    estadoCivil: undefined,
    profissao: '',
    rendaMensal: undefined,
    pessoaComDeficiencia: false,

    // Address
    rua: '',
    numero: '',
    bairro: 'Pavuna',
    cidade: 'Rio de Janeiro',
    cep: '',
    complemento: '',
    pontoReferencia: '',
    numeroComodos: 1,
    tipoMoradia: undefined,
    banheiro: true,
    aguaEncanada: true,
    energiaEletrica: true,
    esgoto: true,

    // Benefits
    bolsaFamilia: false,
    cadUnico: false,
    loas: false,
    carteiraIdoso: false,
    cartaoFamiliaCarioca: false,
    minhaCasaMinhaVida: false,
    paif: false,
    pronatec: false,
    aposentadoria: false,
    isencaoConcursoPublico: false,
    cadastroParaEmprego: false,
    tarifaSocialEnergiaEletrica: false,
    outrosBeneficios: '',
    beneficiosObservacao: '',

    // Health
    cartaoSUS: false,
    numeroCartaoSUS: '',
    clinicaFamilia: '',
    postoSaude: '',
    tratamentoHospitalar: false,
    hospital: '',
    tratamentoSaude: '',
    medicamentos: '',
    saudeObservacao: '',

    // Interests
    // Palestras
    programasSociais: false,
    violenciaDomestica: false,
    dependenciaQuimica: false,
    meioAmbiente: false,
    documentacaoPessoal: false,
    saudeGeral: false,
    empreendedorismo: false,
    sustentabilidade: false,
    // Cursos
    pinturaEmTecido: false,
    bijuteria: false,
    cestaria: false,
    costura: false,
    bordado: false,
    croche: false,
    trico: false,
    teatro: false,
    reciclagem: false,
    informatica: false,
    cursos: false,
    alfabetizacao: false,

    // Dependents
    dependentes: [],

    // Cesta Type
    tipoCestaId: '',
  });

  const updateFormData = (data: Partial<BeneficiarioFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const markStepAsCompleted = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps((prev) => [...prev, stepIndex]);
    }
  };

  const handlePersonalInfoSubmit = async () => {
    if (!formData.nome) {
      toast.error('Nome é obrigatório');
      return false;
    }

    if (!formData.sexo) {
      toast.error('Sexo é obrigatório');
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = beneficiarioId ? await updateBeneficiary() : await createBeneficiary();

      if (!response?.success) {
        toast.error(response?.error ?? 'Erro ao salvar informações pessoais');
        return false;
      }

      if (!beneficiarioId) {
        setBeneficiarioId(response.data!.id);
      }

      toast.success(
        beneficiarioId
          ? 'Informações pessoais atualizadas com sucesso!'
          : 'Informações pessoais salvas com sucesso!',
      );

      markStepAsCompleted(0);
      return true;
    } catch (error) {
      console.error('Erro ao salvar assistido:', error);
      toast.error('Ocorreu um erro ao salvar o assistido');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBeneficiary = async () => {
    return await criarBeneficiario({
      beneficiarioId: beneficiarioId!,
      nome: formData.nome,
      cpf: formData.cpf ? stripMask(formData.cpf) : undefined,
      rg: formData.rg || undefined,
      sexo: formData.sexo as ENUM_SEXO_BENEFICIARIO,
      dataNascimento: formData.dataNascimento
        ? toLocalIsoMidnight(formData.dataNascimento)
        : undefined,
      telefone: formData.telefone ? stripMask(formData.telefone) : undefined,
      estadoCivil: formData.estadoCivil as ENUM_ESTADO_CIVIL_BENEFICIARIO,
      profissao: formData.profissao || undefined,
      rendaMensal: formData.rendaMensal || undefined,
      pessoaComDeficiencia: formData.pessoaComDeficiencia,
    });
  };

  const createBeneficiary = async () => {
    return await criarBeneficiario({
      nome: formData.nome,
      cpf: formData.cpf ? stripMask(formData.cpf) : undefined,
      rg: formData.rg || undefined,
      sexo: formData.sexo as ENUM_SEXO_BENEFICIARIO,
      dataNascimento: formData.dataNascimento
        ? toLocalIsoMidnight(formData.dataNascimento)
        : undefined,
      telefone: formData.telefone ? stripMask(formData.telefone) : undefined,
      estadoCivil: formData.estadoCivil as ENUM_ESTADO_CIVIL_BENEFICIARIO,
      profissao: formData.profissao || undefined,
      rendaMensal: formData.rendaMensal || undefined,
      pessoaComDeficiencia: formData.pessoaComDeficiencia,
    });
  };

  const handleAddressSubmit = async () => {
    if (!beneficiarioId) {
      toast.error('Erro: Assistido não criado');
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await atualizarEndereco({
        beneficiarioId,
        body: {
          rua: formData.rua || undefined,
          numero: formData.numero || undefined,
          bairro: formData.bairro || undefined,
          cidade: formData.cidade || undefined,
          cep: formData.cep ? stripMask(formData.cep) : undefined,
          complemento: formData.complemento || undefined,
          pontoReferencia: formData.pontoReferencia || undefined,
          numeroComodos: formData.numeroComodos,
          tipoMoradia: formData.tipoMoradia as ENUM_TIPO_MORADIA_BENEFICIARIO,
          banheiro: formData.banheiro,
          aguaEncanada: formData.aguaEncanada,
          energiaEletrica: formData.energiaEletrica,
          esgoto: formData.esgoto,
        },
      });

      if (!response?.success) {
        toast.error(response?.error ?? 'Erro ao cadastrar endereço');
        return false;
      }

      markStepAsCompleted(1);
      toast.success('Endereço salvo com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar endereço:', error);
      toast.error('Ocorreu um erro ao cadastrar o endereço');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBenefitsSubmit = async () => {
    if (!beneficiarioId) {
      toast.error('Erro: Assistido não criado');
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await atualizarBeneficiosSociais({
        beneficiarioId,
        body: {
          bolsaFamilia: formData.bolsaFamilia,
          cadUnico: formData.cadUnico,
          loas: formData.loas,
          carteiraIdoso: formData.carteiraIdoso,
          cartaoFamiliaCarioca: formData.cartaoFamiliaCarioca,
          minhaCasaMinhaVida: formData.minhaCasaMinhaVida,
          paif: formData.paif,
          pronatec: formData.pronatec,
          aposentadoria: formData.aposentadoria,
          isencaoConcursoPublico: formData.isencaoConcursoPublico,
          cadastroParaEmprego: formData.cadastroParaEmprego,
          tarifaSocialEnergiaEletrica: formData.tarifaSocialEnergiaEletrica,
          outrosBeneficios: formData.outrosBeneficios || undefined,
          observacao: formData.beneficiosObservacao || undefined,
        },
      });

      if (!response?.success) {
        toast.error(response?.error ?? 'Erro ao cadastrar benefícios sociais');
        return false;
      }

      markStepAsCompleted(2);
      toast.success('Benefícios sociais salvos com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar benefícios sociais:', error);
      toast.error('Ocorreu um erro ao cadastrar os benefícios sociais');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHealthSubmit = async () => {
    if (!beneficiarioId) {
      toast.error('Erro: Assistido não criado');
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await atualizarSaude({
        beneficiarioId,
        body: {
          cartaoSUS: formData.cartaoSUS,
          numeroCartaoSUS: formData.numeroCartaoSUS || undefined,
          clinicaFamilia: formData.clinicaFamilia || undefined,
          postoSaude: formData.postoSaude || undefined,
          tratamentoHospitalar: formData.tratamentoHospitalar,
          hospital: formData.hospital || undefined,
          tratamentoSaude: formData.tratamentoSaude || undefined,
          medicamentos: formData.medicamentos || undefined,
          observacao: formData.saudeObservacao || undefined,
        },
      });

      if (!response?.success) {
        toast.error(response?.error ?? 'Erro ao cadastrar informações de saúde');
        return false;
      }

      markStepAsCompleted(3);
      toast.success('Informações de saúde salvas com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar informações de saúde:', error);
      toast.error('Ocorreu um erro ao cadastrar as informações de saúde');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestsSubmit = async () => {
    if (!beneficiarioId) {
      toast.error('Erro: Assistido não criado');
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await atualizarInteresses({
        beneficiarioId,
        body: {
          // Palestras
          programasSociais: formData.programasSociais,
          violenciaDomestica: formData.violenciaDomestica,
          dependenciaQuimica: formData.dependenciaQuimica,
          meioAmbiente: formData.meioAmbiente,
          documentacaoPessoal: formData.documentacaoPessoal,
          saudeGeral: formData.saudeGeral,
          empreendedorismo: formData.empreendedorismo,
          sustentabilidade: formData.sustentabilidade,
          // Cursos
          pinturaEmTecido: formData.pinturaEmTecido,
          bijuteria: formData.bijuteria,
          cestaria: formData.cestaria,
          costura: formData.costura,
          bordado: formData.bordado,
          croche: formData.croche,
          trico: formData.trico,
          teatro: formData.teatro,
          reciclagem: formData.reciclagem,
          informatica: formData.informatica,
          cursos: formData.cursos,
          alfabetizacao: formData.alfabetizacao,
        },
      });

      if (!response?.success) {
        toast.error(response?.error ?? 'Erro ao cadastrar interesses');
        return false;
      }

      markStepAsCompleted(4);
      toast.success('Interesses salvos com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar interesses:', error);
      toast.error('Ocorreu um erro ao cadastrar os interesses');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDependentsSubmit = async () => {
    if (!beneficiarioId) {
      toast.error('Erro: Assistido não criado');
      return false;
    }

    if (formData.dependentes.length === 0) {
      markStepAsCompleted(5);
      return true;
    }

    setIsSubmitting(true);
    try {
      const response = await adicionarDependentes({
        beneficiarioId,
        body: {
          dependentes: formData.dependentes.map((dep) => ({
            nome: dep.nome,
            parentesco: dep.parentesco,
            sexo: dep.sexo as ENUM_SEXO_BENEFICIARIO,
            dataNascimento: toLocalIsoMidnight(dep.dataNascimento),
            cpf: dep.cpf || undefined,
            rg: dep.rg || undefined,
            certidaoNascimento: dep.certidaoNascimento || undefined,
            escolaridade: dep.escolaridade || undefined,
            telefone: dep.telefone || undefined,
            email: dep.email || undefined,
            rendaMensal: dep.rendaMensal || undefined,
            trabalho: dep.trabalho || undefined,
            observacao: dep.observacao || undefined,
          })),
        },
      });

      if (!response?.success) {
        toast.error(response?.error ?? 'Erro ao cadastrar dependentes');
        return false;
      }

      markStepAsCompleted(5);
      toast.success('Dependentes salvos com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar dependentes:', error);
      toast.error('Ocorreu um erro ao cadastrar os dependentes');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCestaTypeSubmit = async () => {
    if (!beneficiarioId) {
      toast.error('Erro: Assistido não criado');
      return false;
    }

    if (!formData.tipoCestaId) {
      toast.error('Selecione um tipo de cesta');
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await atualizarTipoCesta({
        beneficiarioId,
        body: {
          tipoCestaId: formData.tipoCestaId,
        },
      });

      if (!response?.success) {
        toast.error(response?.error ?? 'Erro ao definir tipo de cesta');
        return false;
      }

      markStepAsCompleted(6);
      toast.success('Tipo de cesta definido com sucesso!');
      toast.success('Assistido cadastrado com sucesso!');
      onComplete();
      return true;
    } catch (error) {
      console.error('Erro ao definir tipo de cesta:', error);
      toast.error('Ocorreu um erro ao definir o tipo de cesta');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    let success = false;

    switch (currentStep) {
      case 0:
        success = await handlePersonalInfoSubmit();
        break;
      case 1:
        success = await handleAddressSubmit();
        break;
      case 2:
        success = await handleBenefitsSubmit();
        break;
      case 3:
        success = await handleHealthSubmit();
        break;
      case 4:
        success = await handleInterestsSubmit();
        break;
      case 5:
        success = await handleDependentsSubmit();
        break;
      case 6:
        success = await handleCestaTypeSubmit();
        return;
      default:
        success = true;
    }

    if (success && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <AddressStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <BenefitsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <HealthStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <InterestsStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return (
          <DependentsStep
            dependentes={formData.dependentes}
            updateDependentes={(dependentes) => updateFormData({ dependentes })}
          />
        );
      case 6:
        return (
          <CestaTypeStep
            tipoCestaId={formData.tipoCestaId}
            updateTipoCestaId={(tipoCestaId) => updateFormData({ tipoCestaId })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Steps indicator */}
      <nav aria-label="Progress" className="overflow-x-auto pb-2">
        <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.id} className="md:flex-1">
              <div
                className={`flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${(() => {
                  if (index === currentStep) {
                    return 'border-primary';
                  }
                  if (completedSteps.includes(index)) {
                    return 'border-primary/40';
                  }
                  return 'border-muted';
                })()}`}
              >
                <span className="text-sm font-medium flex items-center gap-2">
                  {(() => {
                    if (completedSteps.includes(index)) {
                      return <CheckCircle2 className="h-4 w-4 text-primary" />;
                    }
                    return <step.icon className="h-4 w-4" />;
                  })()}
                  {step.title}
                </span>
                <span className="text-sm text-muted-foreground">{step.description}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <Separator />

      {currentStep === 0 && beneficiarioId ? (
        <div className="flex gap-2 items-center text-amber-600 bg-amber-50 p-2 rounded-md w-full mb-2">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">
            Você está editando as informações do assistido. Alterações feitas aqui atualizarão os
            dados existentes.
          </p>
        </div>
      ) : null}

      {/* Form steps */}
      <div className="mt-8 min-h-[400px]">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex flex-wrap justify-between gap-4 mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        <Button onClick={handleNext} disabled={isSubmitting} className="w-full md:w-auto">
          {(() => {
            if (isSubmitting) return 'Salvando...';
            if (currentStep === steps.length - 1) return 'Finalizar Cadastro';
            return 'Próximo';
          })()}
          {currentStep < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
