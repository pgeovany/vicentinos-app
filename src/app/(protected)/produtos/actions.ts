'use server';

import { estoqueApi } from '@/api/estoque';
import { produtoApi } from '@/api/produtos';
import { CriarProdutoDto, ListarProdutosDto } from '@/api/produtos/schemas';
import { ApiError } from '@/api/types';

export async function cadastrarProduto(body: CriarProdutoDto) {
  try {
    const { data } = await produtoApi.criar(body);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao cadastrar produto', data: null };
  }
}

export async function listarProdutos(query: ListarProdutosDto) {
  try {
    const { data } = await produtoApi.listar(query);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao buscar lista de produtos', data: null };
  }
}

export async function listarEstoque() {
  try {
    const { data } = await estoqueApi.analisarEstoque();

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao buscar dados do estoque', data: null };
  }
}
