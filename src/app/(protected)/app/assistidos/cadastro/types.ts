export type DependentFormData = {
  nome: string;
  cpf?: string;
  rg?: string;
  certidaoNascimento?: string;
  dataNascimento: string;
  parentesco: string;
  sexo: string;
  escolaridade?: string;
  telefone?: string;
  email?: string;
  rendaMensal?: string;
  trabalho?: string;
  observacao?: string;
};

export type BeneficiarioFormData = {
  // Personal info
  nome: string;
  cpf: string;
  rg: string;
  sexo: string;
  dataNascimento: string;
  telefone: string;
  estadoCivil: string;
  profissao: string;
  rendaMensal: string;
  pessoaComDeficiencia: boolean;

  // Address
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  complemento: string;
  pontoReferencia: string;
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

  // Benefits
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
  outrosBeneficios: string;
  beneficiosObservacao: string;

  // Health
  cartaoSUS: boolean;
  numeroCartaoSUS: string;
  clinicaFamilia: string;
  postoSaude: string;
  tratamentoHospitalar: boolean;
  hospital: string;
  tratamentoSaude: string;
  medicamentos: string;
  saudeObservacao: string;

  // Interests
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

  // Dependents
  dependentes: DependentFormData[];

  // Cesta Type
  tipoCestaId: string;
};
