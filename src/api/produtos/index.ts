import { api } from '../axios-instance';
import { ApiResponse } from '../types';
import {
  CriarProdutoDto,
  ListarProdutosDto,
  EditarProdutoDto,
  AlterarStatusProdutoDto,
} from './schemas';
import { ProdutoComEstoque, ListarProdutos } from './types';

export const produtoApi = {
  criar: async (body: CriarProdutoDto) => {
    const { data } = await api.post<ApiResponse<ProdutoComEstoque>>(
      '/produto',
      body
    );

    return data;
  },

  listar: async (query: ListarProdutosDto) => {
    const { data } = await api.get<ApiResponse<ListarProdutos>>('/produto', {
      params: query,
    });

    return data;
  },

  editar: async (params: { produtoId: string; body: EditarProdutoDto }) => {
    const { produtoId, body } = params;

    const { data } = await api.put<ApiResponse<ProdutoComEstoque>>(
      `/produto/${produtoId}`,
      body
    );

    return data;
  },

  alterarStatus: async (params: {
    produtoId: string;
    body: AlterarStatusProdutoDto;
  }) => {
    const { produtoId, body } = params;

    const { data } = await api.put<ApiResponse<ProdutoComEstoque>>(
      `/produto/${produtoId}/alterar-status`,
      body
    );

    return data;
  },
};
