interface EnderecoBeneficiario {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  complemento?: string;
}

interface DependenteBeneficiario {
  id: string;
  nome: string;
  parentesco: string;
}

interface TipoCestaBeneficiario {
  id: string;
  nome: string;
}

interface HistoricoRecebimentosBeneficiario {
  id: string;
  tipoCestaId: string;
  nomeCesta: string;
  criadoEm: string;
}

export interface BeneficiarioResponse {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
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
