import { z } from 'zod';
import { ENUM_RECEBIMENTO_DOACAO_ORIGEM } from './types';

export const ItemDoacaoSchema = z.object({
  produtoId: z.string().min(1, 'ID do produto é obrigatório'),
  quantidade: z.number().int().min(1, 'Quantidade deve ser maior que zero'),
});

export const SalvarDoacaoSchema = z.object({
  origem: z.nativeEnum(ENUM_RECEBIMENTO_DOACAO_ORIGEM, {
    errorMap: () => ({ message: 'Origem da doação inválida' }),
  }),
  itens: z.array(ItemDoacaoSchema).min(1, 'Adicione pelo menos um item'),
});

export const ListarDoacoesSchema = z
  .object({
    origem: z.nativeEnum(ENUM_RECEBIMENTO_DOACAO_ORIGEM).optional(),
    pagina: z.string().regex(/^\d+$/, 'Página deve ser um número').optional().default('1'),
    quantidade: z.string().regex(/^\d+$/, 'Quantidade deve ser um número').optional().default('15'),
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

export const ObterEstatisticasDoacoesSchema = z
  .object({
    origem: z.nativeEnum(ENUM_RECEBIMENTO_DOACAO_ORIGEM).optional(),
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

export type ItemDoacaoDto = z.infer<typeof ItemDoacaoSchema>;
export type SalvarDoacaoDto = z.infer<typeof SalvarDoacaoSchema>;
export type ListarDoacoesDto = z.infer<typeof ListarDoacoesSchema>;
export type ObterEstatisticasDoacoesDto = z.infer<typeof ObterEstatisticasDoacoesSchema>;
