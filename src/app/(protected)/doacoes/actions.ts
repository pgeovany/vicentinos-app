'use server';

import { doacaoApi } from '@/api/doacoes';
import { ListarDoacoesDto, SalvarDoacaoDto } from '@/api/doacoes/schemas';
import { ApiError } from '@/api/types';

export async function salvarDoacao(body: SalvarDoacaoDto) {
  try {
    const { data } = await doacaoApi.salvar(body);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao salvar doação', data: null };
  }
}

export async function listarDoacoes(query: ListarDoacoesDto) {
  try {
    const { data } = await doacaoApi.listar(query);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao listar doações', data: null };
  }
}

export async function obterEstatisticasDoacoes(query: ListarDoacoesDto) {
  try {
    const { data } = await doacaoApi.obterEstatisticas(query);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao obter estatísticas de doações', data: null };
  }
}
