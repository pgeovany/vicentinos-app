'use server';

import { cestaApi } from '@/api/cestas';
import {
  AdicionarProdutosCestaDto,
  CriarCestaDto,
  ListarDistribuicoesPendentesDto,
} from '@/api/cestas/schemas';
import { ApiError } from '@/api/types';

export async function criarCesta(body: CriarCestaDto) {
  try {
    const { data } = await cestaApi.criar(body);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao criar cesta', data: null };
  }
}

export async function listarTiposCestas() {
  try {
    const { data } = await cestaApi.listarTiposCestas();

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao buscar tipos de cesta', data: null };
  }
}

export async function adicionarProdutosCesta(params: {
  cestaId: string;
  body: AdicionarProdutosCestaDto;
}) {
  try {
    const { data } = await cestaApi.adicionarProdutos(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao adicionar produtos na cesta', data: null };
  }
}

export async function removerProdutoCesta(params: { cestaId: string; produtoId: string }) {
  try {
    const { data } = await cestaApi.removerProduto(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao remover produto da cesta', data: null };
  }
}

export async function listarDistribuicoesCestasPendentes(query: ListarDistribuicoesPendentesDto) {
  try {
    const { data } = await cestaApi.listarDistribuicoesPendentes(query);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao buscar distribuições pendentes', data: null };
  }
}

export async function entregarCesta(beneficiarioId: string) {
  try {
    const { data } = await cestaApi.entregar(beneficiarioId);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao entregar cesta', data: null };
  }
}
