interface ItemDoacao {
  id: string;
  nome: string;
  quantidade: number;
}

export interface Sos {
  id: string;
  beneficiario: string;
  motivo: string;
  criadoEm: Date;
  itens: ItemDoacao[];
}

export interface ListarSos {
  dataInicio?: string;
  dataFim?: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  resultado: Sos[];
}

interface ProdutoSosEstatistica {
  nome: string;
  quantidade: number;
}

export interface EstatisticasSos {
  dataInicio?: string;
  dataFim?: string;
  totalDistribuicoes: number;
  totalItensDistribuidos: number;
  mediaItensPorDistribuicao: number;
  quantidadePorProduto: ProdutoSosEstatistica[];
}
