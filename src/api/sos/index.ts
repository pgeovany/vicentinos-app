import { api } from '../axios-instance';
import { ApiResponse } from '../types';
import { SalvarSosDto, ListarSosDto, ObterEstatisticasSosDto } from './schemas';
import { Sos, ListarSos, EstatisticasSos } from './types';

export const sosApi = {
  salvar: async (body: SalvarSosDto) => {
    const { data } = await api.post<ApiResponse<Sos>>(
      '/distribuicao-emergencial',
      body
    );

    return data;
  },

  listar: async (query: ListarSosDto) => {
    const { data } = await api.get<ApiResponse<ListarSos>>(
      '/distribuicao-emergencial',
      { params: query }
    );

    return data;
  },

  obterEstatisticas: async (query: ObterEstatisticasSosDto) => {
    const { data } = await api.get<ApiResponse<EstatisticasSos>>(
      '/distribuicao-emergencial/estatisticas',
      { params: query }
    );

    return data;
  },
};
