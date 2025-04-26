'use server';

import { transparenciaApi } from '@/api/transparencia';
import { ApiError } from '@/api/types';

export async function obterDadosTransparencia() {
  try {
    const { data } = await transparenciaApi.obterDados();

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao buscar dados de transparência', data: null };
  }
}

export async function listaProdutosTransparencia() {
  try {
    const { data } = await transparenciaApi.listarProdutosMaisNecessitados();

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao buscar lista de produtos', data: null };
  }
}
