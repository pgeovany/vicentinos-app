interface ItemDoacao {
  id: string;
  nome: string;
  quantidade: number;
}

interface TotalPorOrigem {
  origem: string;
  total: number;
}

interface ProdutoDoacaoEstatistica {
  nome: string;
  quantidade: number;
}

export interface RecebimentoDoacao {
  id: string;
  origem: string;
  criadoEm: Date;
  itens: ItemDoacao[];
}

export interface ListarDoacoes {
  origem?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  resultado: RecebimentoDoacao[];
}

export interface EstatisticasDoacoes {
  dataInicio?: string;
  dataFim?: string;
  totalDoacoes: number;
  totalItensDoados: number;
  mediaItensPorDoacao: number;
  totalPorOrigem: TotalPorOrigem[];
  produtos: ProdutoDoacaoEstatistica[];
}

export enum ENUM_RECEBIMENTO_DOACAO_ORIGEM {
  MISSA_DOMINGO = 'MISSA_DOMINGO',
  MISSA_SABADO = 'MISSA_SABADO',
  MISSA_SEMANA = 'MISSA_SEMANA',
  CAMPANHA = 'CAMPANHA',
  PONTUAL = 'PONTUAL',
  OUTROS = 'OUTROS',
}
