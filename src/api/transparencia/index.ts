import { api } from '../axios-instance';
import { ApiResponse } from '../types';
import { DadosTransparencia, ListarProdutosMaisNecessitados } from './types';

export const transparenciaApi = {
  obterDados: async () => {
    const { data } = await api.get<ApiResponse<DadosTransparencia>>('/transparencia/obter-dados');

    return data;
  },

  listarProdutosMaisNecessitados: async () => {
    const { data } = await api.get<ApiResponse<ListarProdutosMaisNecessitados>>('/public/estoque');

    return data;
  },
};
