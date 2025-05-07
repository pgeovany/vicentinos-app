import { api } from '../axios-instance';
import { ApiResponse } from '../types';
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
} from './schemas';
import {
  BeneficiarioComHistoricoResponse,
  CriarBeneficiarioResponse,
  ListarBeneficiariosResponse,
} from './types';

export const beneficiarioApi = {
  criar: async (body: CriarBeneficiarioDto) => {
    const { data } = await api.post<ApiResponse<CriarBeneficiarioResponse>>('/beneficiario', body);

    return data;
  },

  adicionarDependentes: async (params: {
    beneficiarioId: string;
    body: AdicionarDependentesDto;
  }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.post<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/dependentes`,
      body,
    );

    return data;
  },

  editarDependente: async (params: {
    beneficiarioId: string;
    dependenteId: string;
    body: EditarDependenteDto;
  }) => {
    const { beneficiarioId, dependenteId, body } = params;

    const { data } = await api.put<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/dependentes/${dependenteId}`,
      body,
    );

    return data;
  },

  removerDependente: async (params: { beneficiarioId: string; dependenteId: string }) => {
    const { beneficiarioId, dependenteId } = params;

    const { data } = await api.delete<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/dependentes/${dependenteId}`,
    );

    return data;
  },

  atualizarEndereco: async (params: { beneficiarioId: string; body: AtualizarEnderecoDto }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.put<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/endereco`,
      body,
    );

    return data;
  },

  atualizarBeneficiosSociais: async (params: {
    beneficiarioId: string;
    body: AtualizarBeneficiosSociaisDto;
  }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.put<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/beneficios-sociais`,
      body,
    );

    return data;
  },

  atualizarSaude: async (params: { beneficiarioId: string; body: AtualizarSaudeDto }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.put<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/saude`,
      body,
    );

    return data;
  },

  atualizarInteresses: async (params: { beneficiarioId: string; body: AtualizarInteressesDto }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.put<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/interesses`,
      body,
    );

    return data;
  },

  atualizarTipoCesta: async (params: { beneficiarioId: string; body: AtualizarTipoCestaDto }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.put<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/tipo-cesta`,
      body,
    );

    return data;
  },

  buscar: async (beneficiarioId: string) => {
    const { data } = await api.get<ApiResponse<BeneficiarioComHistoricoResponse>>(
      `/beneficiario/${beneficiarioId}`,
    );

    return data;
  },

  listar: async (query: ListarBeneficiariosDto) => {
    const { data } = await api.get<ApiResponse<ListarBeneficiariosResponse>>('/beneficiario', {
      params: query,
    });

    return data;
  },

  desligarBeneficiario: async (params: { beneficiarioId: string; body: CriarDesligamentoDto }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.delete<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/inativar`,
      { data: body },
    );

    return data;
  },

  reativarBeneficiario: async (beneficiarioId: string) => {
    const { data } = await api.put<ApiResponse<void>>(`/beneficiario/${beneficiarioId}/ativar`);

    return data;
  },
};
