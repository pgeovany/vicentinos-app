import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
const cepRegex = /^\d{5}-\d{3}$/;

export enum ENUM_ESTADO_CIVIL_BENEFICIARIO {
  SOLTEIRO = 'SOLTEIRO',
  CASADO = 'CASADO',
  VIUVO = 'VIUVO',
  DIVORCIADO = 'DIVORCIADO',
  UNIAO_ESTAVEL = 'UNIAO_ESTAVEL',
}

export enum ENUM_SEXO_BENEFICIARIO {
  MASCULINO = 'M',
  FEMININO = 'F',
}

export enum ENUM_STATUS_BENEFICIARIO {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export enum ENUM_TIPO_MORADIA_BENEFICIARIO {
  PROPRIO = 'Próprio',
  FINANCIADO = 'Financiado',
  ALUGADO = 'Alugado',
  CEDIDO = 'Cedido',
  HERANCA = 'Herança',
  PROGRAMA_SOCIAL = 'Programa Social',
  OCUPACAO = 'Ocupação',
}

export const dependenteBeneficiarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido').optional().nullable(),
  rg: z.string().optional().nullable(),
  certidaoNascimento: z.string().optional().nullable(),
  dataNascimento: z.coerce.date().optional().nullable(),
  telefone: z.string().regex(phoneRegex, 'Telefone inválido').optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable(),
  parentesco: z.string().min(1, 'Parentesco é obrigatório'),
  sexo: z.nativeEnum(ENUM_SEXO_BENEFICIARIO),
  escolaridade: z.string().optional().nullable(),
  rendaMensal: z.string().optional().nullable(),
  trabalho: z.string().optional().nullable(),
  observacao: z.string().optional().nullable(),
});

export const criarBeneficiarioSchema = z.object({
  beneficiarioId: z.string().optional(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido').optional().nullable(),
  rg: z.string().optional().nullable(),
  sexo: z.nativeEnum(ENUM_SEXO_BENEFICIARIO),
  dataNascimento: z.coerce.date().optional().nullable(),
  telefone: z.string().regex(phoneRegex, 'Telefone inválido').optional().nullable(),
  estadoCivil: z.nativeEnum(ENUM_ESTADO_CIVIL_BENEFICIARIO),
  profissao: z.string().optional().nullable(),
  rendaMensal: z.string().optional().nullable(),
  pessoaComDeficiencia: z.boolean().optional().default(false),
});

export const adicionarDependentesSchema = z.object({
  dependentes: z.array(dependenteBeneficiarioSchema),
});

export const editarDependenteSchema = dependenteBeneficiarioSchema.partial();

export const atualizarEnderecoSchema = z.object({
  rua: z.string().optional().nullable(),
  numero: z.string().optional().nullable(),
  bairro: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  cep: z.string().regex(cepRegex, 'CEP inválido').optional().nullable(),
  complemento: z.string().optional().nullable(),
  pontoReferencia: z.string().optional().nullable(),
  numeroComodos: z.number().int().min(1, 'Número de cômodos é obrigatório'),
  tipoMoradia: z.nativeEnum(ENUM_TIPO_MORADIA_BENEFICIARIO),
  banheiro: z.boolean().optional().default(true),
  aguaEncanada: z.boolean().optional().default(true),
  energiaEletrica: z.boolean().optional().default(true),
  esgoto: z.boolean().optional().default(true),
});

export const atualizarBeneficiosSociaisSchema = z.object({
  bolsaFamilia: z.boolean().optional().default(false),
  cadUnico: z.boolean().optional().default(false),
  loas: z.boolean().optional().default(false),
  carteiraIdoso: z.boolean().optional().default(false),
  cartaoFamiliaCarioca: z.boolean().optional().default(false),
  minhaCasaMinhaVida: z.boolean().optional().default(false),
  paif: z.boolean().optional().default(false),
  pronatec: z.boolean().optional().default(false),
  aposentadoria: z.boolean().optional().default(false),
  isencaoConcursoPublico: z.boolean().optional().default(false),
  cadastroParaEmprego: z.boolean().optional().default(false),
  tarifaSocialEnergiaEletrica: z.boolean().optional().default(false),
  outrosBeneficios: z.string().optional().nullable(),
  observacao: z.string().optional().nullable(),
});

export const atualizarSaudeSchema = z.object({
  cartaoSUS: z.boolean().optional().nullable(),
  numeroCartaoSUS: z.string().optional().nullable(),
  clinicaFamilia: z.string().optional().nullable(),
  postoSaude: z.string().optional().nullable(),
  tratamentoHospitalar: z.boolean().optional().nullable(),
  hospital: z.string().optional().nullable(),
  tratamentoSaude: z.string().optional().nullable(),
  medicamentos: z.string().optional().nullable(),
  observacao: z.string().optional().nullable(),
});

export const atualizarInteressesSchema = z.object({
  // Palestras
  programasSociais: z.boolean().optional().default(false),
  violenciaDomestica: z.boolean().optional().default(false),
  dependenciaQuimica: z.boolean().optional().default(false),
  meioAmbiente: z.boolean().optional().default(false),
  documentacaoPessoal: z.boolean().optional().default(false),
  saudeGeral: z.boolean().optional().default(false),
  empreendedorismo: z.boolean().optional().default(false),
  sustentabilidade: z.boolean().optional().default(false),
  // Cursos
  pinturaEmTecido: z.boolean().optional().default(false),
  bijuteria: z.boolean().optional().default(false),
  cestaria: z.boolean().optional().default(false),
  costura: z.boolean().optional().default(false),
  bordado: z.boolean().optional().default(false),
  croche: z.boolean().optional().default(false),
  trico: z.boolean().optional().default(false),
  teatro: z.boolean().optional().default(false),
  reciclagem: z.boolean().optional().default(false),
  informatica: z.boolean().optional().default(false),
  cursos: z.boolean().optional().default(false),
  alfabetizacao: z.boolean().optional().default(false),
});

export const atualizarTipoCestaSchema = z.object({
  tipoCestaId: z.string().min(1, 'ID do tipo de cesta é obrigatório'),
});

export const criarDesligamentoSchema = z.object({
  motivo: z.string().min(1, 'Motivo é obrigatório'),
});

export const listarBeneficiariosSchema = z.object({
  nome: z.string().optional(),
  tipoCestaId: z.string().optional(),
  status: z.nativeEnum(ENUM_STATUS_BENEFICIARIO).optional(),
  pagina: z.number().int().positive().optional(),
  quantidade: z.number().int().positive().optional(),
});

export type DependenteBeneficiarioDto = z.infer<typeof dependenteBeneficiarioSchema>;
export type EditarDependenteDto = z.infer<typeof editarDependenteSchema>;
export type CriarBeneficiarioDto = z.infer<typeof criarBeneficiarioSchema>;
export type AdicionarDependentesDto = z.infer<typeof adicionarDependentesSchema>;
export type AtualizarEnderecoDto = z.infer<typeof atualizarEnderecoSchema>;
export type AtualizarBeneficiosSociaisDto = z.infer<typeof atualizarBeneficiosSociaisSchema>;
export type AtualizarSaudeDto = z.infer<typeof atualizarSaudeSchema>;
export type AtualizarInteressesDto = z.infer<typeof atualizarInteressesSchema>;
export type AtualizarTipoCestaDto = z.infer<typeof atualizarTipoCestaSchema>;
export type CriarDesligamentoDto = z.infer<typeof criarDesligamentoSchema>;
export type ListarBeneficiariosDto = z.infer<typeof listarBeneficiariosSchema>;
