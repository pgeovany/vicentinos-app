interface MovimentacaoTotaisItem {
  produtoId: string;
  nome: string;
  totalEntradas: number;
  totalSaidas: number;
}

interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  produto: string;
  estoqueProdutoId: string;
  quantidade: number;
  tipo: string;
  motivo?: string;
  criadoEm: string;
  atualizadoEm: string;
}

interface ProdutoAnaliseEstoque {
  id: string;
  nome: string;
  quantidadeReservada: number;
  quantidadeDisponivel: number;
  saldo: number;
  suficiente: boolean;
}

interface TotaisAnaliseEstoque {
  produtosInsuficientes: number;
  produtosSuficientes: number;
}

export interface ListarMovimentacoesEstoque {
  nome?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  resultado: MovimentacaoEstoque[];
}

export interface ListarMovimentacaoTotais {
  produto?: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  resultado: MovimentacaoTotaisItem[];
}

export interface AnalisarEstoque {
  produtos: ProdutoAnaliseEstoque[];
  totais: TotaisAnaliseEstoque;
}
