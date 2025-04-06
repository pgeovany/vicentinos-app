interface ItemCesta {
  id: string;
  nome: string;
  quantidade: number;
}

interface TipoCestaDistribuicao {
  id: string;
  nome: string;
  produtos: ItemCesta[];
}

interface BeneficiarioDistribuicao {
  id: string;
  nome: string;
  tipoCesta: TipoCestaDistribuicao;
}

interface BeneficiarioHistoricoDistribuicao {
  id: string;
  nome: string;
}

interface TipoCestaHistoricoDistribuicao {
  id: string;
  nome: string;
}

interface DistribuicaoHistorico {
  id: string;
  criadoEm: string;
  beneficiario: BeneficiarioHistoricoDistribuicao;
  tipoCesta: TipoCestaHistoricoDistribuicao;
}

export interface Cesta {
  id: string;
  nome: string;
  status: string;
  descricao: string;
  criadoEm: string;
  atualizadoEm: string;
  produtos: ItemCesta[];
}

export interface ListarTiposCestas {
  cestas: Cesta[];
}

export interface ListarDistribuicoesPendentes {
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  beneficiariosRestantes: number;
  beneficiarios: BeneficiarioDistribuicao[];
}

export interface ListarHistoricoDistribuicoes {
  nome: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  total: number;
  distribuicoes: DistribuicaoHistorico[];
}
