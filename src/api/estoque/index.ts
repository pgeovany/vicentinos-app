import { api } from '../axios-instance';
import { ApiResponse } from '../types';
import {
  ListarMovimentacoesEstoqueDto,
  ListarEntradasESaidasDto,
  RemocaoDiretaEstoqueDto,
} from './schemas';
import { ListarMovimentacoesEstoque, ListarMovimentacaoTotais, AnalisarEstoque } from './types';

export const estoqueApi = {
  listarMovimentacoes: async (query: ListarMovimentacoesEstoqueDto) => {
    const { data } = await api.get<ApiResponse<ListarMovimentacoesEstoque>>(
      '/estoque/movimentacoes',
      { params: query },
    );

    return data;
  },

  listarEntradasESaidas: async (query: ListarEntradasESaidasDto) => {
    const { data } = await api.get<ApiResponse<ListarMovimentacaoTotais>>(
      '/estoque/entradas-saidas',
      { params: query },
    );

    return data;
  },

  analisarEstoque: async () => {
    const { data } = await api.get<ApiResponse<AnalisarEstoque>>('/estoque/analise-estoque');

    return data;
  },

  remocaoDireta: async (body: RemocaoDiretaEstoqueDto) => {
    const { data } = await api.put<ApiResponse<void>>('/estoque/remocao-direta', body);

    return data;
  },
};
