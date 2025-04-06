import { api } from '../axios-instance';
import { ApiResponse } from '../types';
import {
  CriarCestaDto,
  AdicionarProdutosCestaDto,
  ListarDistribuicoesPendentesDto,
  ListarHistoricoDistribuicoesDto,
} from './schemas';
import {
  Cesta,
  ListarDistribuicoesPendentes,
  ListarHistoricoDistribuicoes,
  ListarTiposCestas,
} from './types';

export const cestaApi = {
  criar: async (body: CriarCestaDto) => {
    const { data } = await api.post<ApiResponse<Cesta>>('/cesta/criar', body);

    return data;
  },

  listarTiposCestas: async () => {
    const { data } = await api.get<ApiResponse<ListarTiposCestas>>(
      '/cesta/tipos-cesta'
    );

    return data;
  },

  adicionarProdutos: async (params: {
    cestaId: string;
    body: AdicionarProdutosCestaDto;
  }) => {
    const { cestaId, body } = params;

    const { data } = await api.put<ApiResponse<Cesta>>(
      `/cesta/${cestaId}/produtos`,
      body
    );

    return data;
  },

  removerProduto: async (params: { cestaId: string; produtoId: string }) => {
    const { cestaId, produtoId } = params;

    const { data } = await api.delete<ApiResponse<Cesta>>(
      `/cesta/${cestaId}/produto/${produtoId}`
    );

    return data;
  },

  listarDistribuicoesPendentes: async (
    query: ListarDistribuicoesPendentesDto
  ) => {
    const { data } = await api.get<ApiResponse<ListarDistribuicoesPendentes>>(
      '/cesta/distribuicoes-pendentes',
      { params: query }
    );

    return data;
  },

  entregar: async (beneficiarioId: string) => {
    const { data } = await api.post<ApiResponse<void>>(
      `/cesta/entregar/${beneficiarioId}`
    );

    return data;
  },

  listarHistoricoDistribuicoes: async (
    query: ListarHistoricoDistribuicoesDto
  ) => {
    const { data } = await api.get<ApiResponse<ListarHistoricoDistribuicoes>>(
      '/cesta/historico-distribuicoes',
      { params: query }
    );

    return data;
  },
};
