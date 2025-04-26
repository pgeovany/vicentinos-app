import { z } from 'zod';

const TIPO_MOVIMENTACAO = ['ENTRADA', 'SAIDA'] as const;

export const ListarMovimentacoesEstoqueSchema = z
  .object({
    nome: z.string().optional(),
    tipo: z
      .enum(TIPO_MOVIMENTACAO, {
        errorMap: () => ({ message: 'Tipo deve ser ENTRADA ou SAIDA' }),
      })
      .optional(),
    pagina: z.number().int().min(1).optional().default(1),
    quantidade: z.number().int().min(1).optional().default(15),
    dataInicio: z.string().datetime({ message: 'Data de início inválida' }).optional(),
    dataFim: z.string().datetime({ message: 'Data de fim inválida' }).optional(),
  })
  .refine(
    (data) => {
      if (data.dataInicio && data.dataFim) {
        return new Date(data.dataInicio) <= new Date(data.dataFim);
      }
      return true;
    },
    {
      message: 'Data de início deve ser menor ou igual à data de fim',
      path: ['dataInicio'],
    },
  );

export const ListarEntradasESaidasSchema = z
  .object({
    nome: z.string().optional(),
    pagina: z.number().int().min(1).optional().default(1),
    quantidade: z.number().int().min(1).optional().default(15),
    dataInicio: z.string().datetime({ message: 'Data de início inválida' }).optional(),
    dataFim: z.string().datetime({ message: 'Data de fim inválida' }).optional(),
  })
  .refine(
    (data) => {
      if (data.dataInicio && data.dataFim) {
        return new Date(data.dataInicio) <= new Date(data.dataFim);
      }
      return true;
    },
    {
      message: 'Data de início deve ser menor ou igual à data de fim',
      path: ['dataInicio'],
    },
  );

export const RemocaoDiretaEstoqueSchema = z.object({
  produtoId: z.string().min(1),
  quantidade: z.number().int().min(1),
  motivo: z.string().min(1, { message: 'Motivo é obrigatório' }),
});

export type ListarMovimentacoesEstoqueDto = z.infer<typeof ListarMovimentacoesEstoqueSchema>;
export type ListarEntradasESaidasDto = z.infer<typeof ListarEntradasESaidasSchema>;
export type RemocaoDiretaEstoqueDto = z.infer<typeof RemocaoDiretaEstoqueSchema>;
