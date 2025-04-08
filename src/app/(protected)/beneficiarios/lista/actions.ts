'use server';

import { beneficiarioApi } from '@/api/beneficiarios';
import { ApiError } from '@/api/types';
import { ListarBeneficiariosDto } from '@/api/beneficiarios/schemas';

export async function listarBeneficiarios(query: ListarBeneficiariosDto) {
  try {
    const { data } = await beneficiarioApi.listar(query);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    console.error('Login error:', error);
    return { success: false, error: 'Erro ao realizar login', data: null };
  }
}

export async function detalharBeneficiario(beneficiarioId: string) {
  try {
    const { data } = await beneficiarioApi.buscar(beneficiarioId);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }
  }
}
