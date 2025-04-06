interface EstoqueProduto {
  id: string;
  produtoId: string;
  quantidade: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ProdutoComEstoque {
  id: string;
  nome: string;
  criadoEm: string;
  atualizadoEm: string;
  estoque: EstoqueProduto;
}

export interface ListarProdutos {
  nome: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  resultado: ProdutoComEstoque[];
}

export enum ENUM_STATUS_PRODUTO {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}
