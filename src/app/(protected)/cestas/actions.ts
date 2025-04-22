'use server';

import { cestaApi } from '@/api/cestas';
import { ApiError } from '@/api/types';

export async function listarTiposCestas() {
  try {
    const { data } = await cestaApi.listarTiposCestas();

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    console.error('Login error:', error);
    return { success: false, error: 'Erro ao buscar tipos de cesta', data: null };
  }
}
