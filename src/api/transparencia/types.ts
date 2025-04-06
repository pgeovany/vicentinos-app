interface ProdutoTransparencia {
  id: string;
  nome: string;
  quantidadeNecessaria: number;
}

export interface DadosTransparencia {
  mes: string;
  ano: number;
  familiasBeneficiadas: number;
  atendimentosEmergenciais: number;
  totalAlimentosRecebidos: number;
  familiasCadastradas: number;
  produtosEmNecessidade: ProdutoTransparencia[];
}

export interface ListarProdutosMaisNecessitados {
  produtos: string[];
}
