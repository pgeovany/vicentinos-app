import { api } from '../axios-instance';
import { ApiResponse } from '../types';
import {
  AdicionarDependentesSchema,
  AtualizarEnderecoSchema,
  AtualizarTipoCestaSchema,
  CriarBeneficiarioSchema,
  ListarBeneficiariosSchema,
} from './schemas';
import {
  BeneficiarioComHistoricoResponse,
  BeneficiarioResponse,
  ListarBeneficiariosResponse,
} from './types';

export const beneficiarioApi = {
  criar: async (body: CriarBeneficiarioSchema) => {
    const { data } = await api.post<ApiResponse<BeneficiarioResponse>>(
      '/beneficiario',
      body
    );

    return data;
  },

  adicionarDependentes: async (params: {
    beneficiarioId: string;
    body: AdicionarDependentesSchema;
  }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.post<ApiResponse<BeneficiarioResponse>>(
      `/beneficiario/${beneficiarioId}/dependentes`,
      body
    );

    return data;
  },

  removerDependente: async (params: {
    beneficiarioId: string;
    dependenteId: string;
  }) => {
    const { beneficiarioId, dependenteId } = params;

    const { data } = await api.delete<ApiResponse<void>>(
      `/beneficiario/${beneficiarioId}/dependentes/${dependenteId}`
    );

    return data;
  },

  atualizarEndereco: async (params: {
    beneficiarioId: string;
    body: AtualizarEnderecoSchema;
  }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.put<ApiResponse<BeneficiarioResponse>>(
      `/beneficiario/${beneficiarioId}/endereco`,
      body
    );

    return data;
  },

  atualizarTipoCesta: async (params: {
    beneficiarioId: string;
    body: AtualizarTipoCestaSchema;
  }) => {
    const { beneficiarioId, body } = params;

    const { data } = await api.put<ApiResponse<BeneficiarioResponse>>(
      `/beneficiario/${beneficiarioId}/tipo-cesta`,
      body
    );

    return data;
  },

  buscar: async (beneficiarioId: string) => {
    const { data } = await api.get<
      ApiResponse<BeneficiarioComHistoricoResponse>
    >(`/beneficiario/${beneficiarioId}`);

    return data;
  },

  listar: async (query: ListarBeneficiariosSchema) => {
    const { data } = await api.get<ApiResponse<ListarBeneficiariosResponse>>(
      '/beneficiario',
      { params: query }
    );

    return data;
  },
};
