import { api } from '../axios-instance';
import { ApiResponse } from '../types';
import { ListarDoacoesDto, ObterEstatisticasDoacoesDto, SalvarDoacaoDto } from './schemas';
import { EstatisticasDoacoes, ListarDoacoes, RecebimentoDoacao } from './types';

export const doacaoApi = {
  salvar: async (body: SalvarDoacaoDto) => {
    const { data } = await api.post<ApiResponse<RecebimentoDoacao>>('/recebimento-doacao', body);

    return data;
  },

  listar: async (query: ListarDoacoesDto) => {
    const { data } = await api.get<ApiResponse<ListarDoacoes>>('/recebimento-doacao', {
      params: query,
    });

    return data;
  },

  obterEstatisticas: async (query: ObterEstatisticasDoacoesDto) => {
    const { data } = await api.get<ApiResponse<EstatisticasDoacoes>>(
      '/recebimento-doacao/estatisticas',
      { params: query },
    );

    return data;
  },
};
