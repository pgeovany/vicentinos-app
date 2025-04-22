'use server';

import { beneficiarioApi } from '@/api/beneficiarios';
import { ApiError } from '@/api/types';
import {
  AdicionarDependentesDto,
  AtualizarEnderecoDto,
  CriarBeneficiarioDto,
  ListarBeneficiariosDto,
} from '@/api/beneficiarios/schemas';

export async function criarBeneficiario(body: CriarBeneficiarioDto) {
  try {
    const { data } = await beneficiarioApi.criar(body);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    console.error('Login error:', error);
    return { success: false, error: 'Erro ao realizar login', data: null };
  }
}

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

export async function adicionarDependentes(params: {
  beneficiarioId: string;
  body: AdicionarDependentesDto;
}) {
  try {
    const { data } = await beneficiarioApi.adicionarDependentes(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    console.error('Erro ao adicionar dependentes:', error);
    return { success: false, error: 'Erro ao adicionar dependentes', data: null };
  }
}

export async function removerDependente(params: { beneficiarioId: string; dependenteId: string }) {
  try {
    const { data } = await beneficiarioApi.removerDependente(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }
  }
}

export async function atualizarEndereco(params: {
  beneficiarioId: string;
  body: AtualizarEnderecoDto;
}) {
  try {
    const { data } = await beneficiarioApi.atualizarEndereco(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }
  }
}

export async function alterarStatusBeneficiario(params: { beneficiarioId: string }) {
  try {
    const { data } = await beneficiarioApi.alterarStatus(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }
  }
}

export async function atualizarTipoCesta(params: {
  beneficiarioId: string;
  body: { tipoCestaId: string };
}) {
  try {
    const { data } = await beneficiarioApi.atualizarTipoCesta(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }
  }
}
