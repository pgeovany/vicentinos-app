import { z } from 'zod';
import { ENUM_STATUS_PRODUTO } from './types';
export const CriarProdutoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
});

export const EditarProdutoSchema = CriarProdutoSchema;

export const ListarProdutosSchema = z.object({
  nome: z.string().optional(),
  pagina: z
    .string()
    .regex(/^\d+$/, 'Página deve ser um número')
    .optional()
    .default('1'),
  quantidade: z
    .string()
    .regex(/^\d+$/, 'Quantidade deve ser um número')
    .optional()
    .default('15'),
});

export const AlterarStatusProdutoSchema = z.object({
  status: z.nativeEnum(ENUM_STATUS_PRODUTO, {
    errorMap: () => ({ message: 'Status inválido' }),
  }),
});

// Export types
export type CriarProdutoDto = z.infer<typeof CriarProdutoSchema>;
export type EditarProdutoDto = z.infer<typeof EditarProdutoSchema>;
export type ListarProdutosDto = z.infer<typeof ListarProdutosSchema>;
export type AlterarStatusProdutoDto = z.infer<
  typeof AlterarStatusProdutoSchema
>;
