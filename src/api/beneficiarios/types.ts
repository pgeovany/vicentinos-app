interface EnderecoBeneficiario {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  complemento?: string;
}

export interface DependenteBeneficiario {
  id: string;
  nome: string;
  parentesco: string;
  dataNascimento: Date;
}

interface TipoCestaBeneficiario {
  id: string;
  nome: string;
}

interface HistoricoRecebimentosBeneficiario {
  id: string;
  tipoCestaId: string;
  nomeCesta: string;
  criadoEm: Date;
}

export interface BeneficiarioResponse {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  status: string;
  dataNascimento: Date;
  telefone: string;
  email: string;
  criadoEm: Date;
  endereco: EnderecoBeneficiario;
  tipoCesta: TipoCestaBeneficiario;
  dependentes: DependenteBeneficiario[];
}

export interface BeneficiarioComHistoricoResponse extends BeneficiarioResponse {
  historicoRecebimentos: HistoricoRecebimentosBeneficiario[];
}

export interface ListarBeneficiariosResponse {
  nome?: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  resultado: BeneficiarioResponse[];
}
