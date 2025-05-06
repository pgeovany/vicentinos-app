'use server';

import { beneficiarioApi } from '@/api/beneficiarios';
import { ApiError } from '@/api/types';
import {
  AdicionarDependentesDto,
  AtualizarBeneficiosSociaisDto,
  AtualizarEnderecoDto,
  AtualizarInteressesDto,
  AtualizarSaudeDto,
  AtualizarTipoCestaDto,
  CriarBeneficiarioDto,
  CriarDesligamentoDto,
  EditarDependenteDto,
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

    return { success: false, error: 'Erro ao cadastrar assistido', data: null };
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

    return { success: false, error: 'Erro ao buscar lista de assistidos', data: null };
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

    return { success: false, error: 'Erro ao buscar detalhes do assistido', data: null };
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

    return { success: false, error: 'Erro ao adicionar dependentes', data: null };
  }
}

export async function editarDependente(params: {
  beneficiarioId: string;
  dependenteId: string;
  body: EditarDependenteDto;
}) {
  try {
    const { data } = await beneficiarioApi.editarDependente(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao editar dependente', data: null };
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

    return { success: false, error: 'Erro ao remover dependente', data: null };
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

    return { success: false, error: 'Erro ao atualizar endereço', data: null };
  }
}

export async function atualizarBeneficiosSociais(params: {
  beneficiarioId: string;
  body: AtualizarBeneficiosSociaisDto;
}) {
  try {
    const { data } = await beneficiarioApi.atualizarBeneficiosSociais(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao atualizar benefícios sociais', data: null };
  }
}

export async function atualizarSaude(params: { beneficiarioId: string; body: AtualizarSaudeDto }) {
  try {
    const { data } = await beneficiarioApi.atualizarSaude(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao atualizar informações de saúde', data: null };
  }
}

export async function atualizarInteresses(params: {
  beneficiarioId: string;
  body: AtualizarInteressesDto;
}) {
  try {
    const { data } = await beneficiarioApi.atualizarInteresses(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao atualizar interesses', data: null };
  }
}

export async function atualizarTipoCesta(params: {
  beneficiarioId: string;
  body: AtualizarTipoCestaDto;
}) {
  try {
    const { data } = await beneficiarioApi.atualizarTipoCesta(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao alterar tipo de cesta', data: null };
  }
}

export async function desligarBeneficiario(params: {
  beneficiarioId: string;
  body: CriarDesligamentoDto;
}) {
  try {
    const { data } = await beneficiarioApi.desligarBeneficiario(params);

    return { success: true, error: null, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, data: null };
    }

    return { success: false, error: 'Erro ao desligar assistido', data: null };
  }
}
