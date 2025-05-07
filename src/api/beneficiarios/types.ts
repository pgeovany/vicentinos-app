interface EnderecoBeneficiario {
  id?: string;
  beneficiarioId?: string;
  rua?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  cep?: string | null;
  complemento?: string | null;
  pontoReferencia?: string | null;
  numeroComodos: number;
  proprio: boolean;
  financiado: boolean;
  alugado: boolean;
  cedido: boolean;
  heranca: boolean;
  programaSocial: boolean;
  ocupacao: boolean;
  banheiro: boolean;
  aguaEncanada: boolean;
  energiaEletrica: boolean;
  esgoto: boolean;
}

interface BeneficiosSociaisBeneficiario {
  id?: string;
  beneficiarioId?: string;
  bolsaFamilia: boolean;
  cadUnico: boolean;
  loas: boolean;
  carteiraIdoso: boolean;
  cartaoFamiliaCarioca: boolean;
  minhaCasaMinhaVida: boolean;
  paif: boolean;
  pronatec: boolean;
  aposentadoria: boolean;
  isencaoConcursoPublico: boolean;
  cadastroParaEmprego: boolean;
  tarifaSocialEnergiaEletrica: boolean;
  outrosBeneficios?: string | null;
  observacao?: string | null;
}

interface SaudeBeneficiario {
  id?: string;
  beneficiarioId?: string;
  cartaoSUS?: boolean | null;
  numeroCartaoSUS?: string | null;
  clinicaFamilia?: string | null;
  postoSaude?: string | null;
  tratamentoHospitalar?: boolean | null;
  hospital?: string | null;
  tratamentoSaude?: string | null;
  medicamentos?: string | null;
  observacao?: string | null;
}

interface InteressesBeneficiario {
  id?: string;
  beneficiarioId?: string;
  // Palestras
  programasSociais: boolean;
  violenciaDomestica: boolean;
  dependenciaQuimica: boolean;
  meioAmbiente: boolean;
  documentacaoPessoal: boolean;
  saudeGeral: boolean;
  empreendedorismo: boolean;
  sustentabilidade: boolean;
  // Cursos
  pinturaEmTecido: boolean;
  bijuteria: boolean;
  cestaria: boolean;
  costura: boolean;
  bordado: boolean;
  croche: boolean;
  trico: boolean;
  teatro: boolean;
  reciclagem: boolean;
  informatica: boolean;
  cursos: boolean;
  alfabetizacao: boolean;
}

export interface DependenteBeneficiario {
  id: string;
  beneficiarioId: string;
  nome: string;
  cpf?: string | null;
  rg?: string | null;
  certidaoNascimento?: string | null;
  parentesco: string;
  escolaridade?: string | null;
  sexo: string;
  dataNascimento: Date | null;
  rendaMensal?: string | null;
  trabalho?: string | null;
  observacao?: string | null;
}

interface TipoCestaBeneficiario {
  id: string;
  nome: string;
}

interface HistoricoRecebimentosBeneficiario {
  id: string;
  tipoCestaId?: string | null;
  nomeCesta?: string | null;
  criadoEm: Date;
}

interface DesligamentoBeneficiario {
  id: string;
  motivo: string | null;
  criadoEm: Date;
}

export interface BeneficiarioResponse {
  id: string;
  nome: string;
  cpf: string | null;
  rg: string | null;
  sexo: string;
  status: string;
  dataNascimento: Date | null;
  telefone: string | null;
  estadoCivil: string | null;
  profissao: string | null;
  rendaMensal: string | null;
  pessoaComDeficiencia: boolean;
  tipoCestaId: string | null;
  criadoEm: Date;
  atualizadoEm: Date | null;
  endereco?: EnderecoBeneficiario | null;
  beneficiosSociais?: BeneficiosSociaisBeneficiario | null;
  saude?: SaudeBeneficiario | null;
  interesses?: InteressesBeneficiario | null;
  tipoCesta?: TipoCestaBeneficiario | null;
  dependentes: DependenteBeneficiario[];
  historicoDesligamentos: DesligamentoBeneficiario[];
}

export interface CriarBeneficiarioResponse {
  id: string;
  nome: string;
  cpf: string | null;
  rg: string | null;
  sexo: string;
  status: string;
  dataNascimento: Date | null;
  telefone: string | null;
  estadoCivil: string | null;
  profissao: string | null;
  rendaMensal: string | null;
  pessoaComDeficiencia: boolean;
  tipoCestaId: string | null;
  criadoEm: Date;
  atualizadoEm: Date | null;
}

export interface BeneficiarioComHistoricoResponse extends BeneficiarioResponse {
  historicoRecebimentos: HistoricoRecebimentosBeneficiario[];
}

export interface BeneficiarioNaListaResponse {
  id: string;
  nome: string;
  status: string;
  criadoEm: Date;
  tipoCesta?: TipoCestaBeneficiario | null;
}

export interface ListarBeneficiariosResponse {
  nome?: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  resultado: BeneficiarioNaListaResponse[];
}
