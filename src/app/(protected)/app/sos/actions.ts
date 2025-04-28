'use server';

import { sosApi } from '@/api/sos';
import { ListarSosDto, ObterEstatisticasSosDto, SalvarSosDto } from '@/api/sos/schemas';
import { ApiError } from '@/api/types';

export async function salvarSos(body: SalvarSosDto) {
  try {
    const { data } = await sosApi.salvar(body);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao salvar SOS', data: null };
  }
}

export async function listarSos(query: ListarSosDto) {
  try {
    const { data } = await sosApi.listar(query);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao listar SOS', data: null };
  }
}

export async function obterEstatisticasSos(query: ObterEstatisticasSosDto) {
  try {
    const { data } = await sosApi.obterEstatisticas(query);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao obter estatísticas de SOS', data: null };
  }
}
