import { z } from 'zod';

const ItemSosSchema = z.object({
  produtoId: z.string().min(1, 'ID do produto é obrigatório'),
  quantidade: z.number().int().min(1, 'Quantidade deve ser maior que zero'),
});

export const ListarSosSchema = z
  .object({
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
    dataInicio: z
      .string()
      .datetime({ message: 'Data de início inválida' })
      .optional(),
    dataFim: z
      .string()
      .datetime({ message: 'Data de fim inválida' })
      .optional(),
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
    }
  );

export const ObterEstatisticasSosSchema = z
  .object({
    dataInicio: z
      .string()
      .datetime({ message: 'Data de início inválida' })
      .optional(),
    dataFim: z
      .string()
      .datetime({ message: 'Data de fim inválida' })
      .optional(),
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
    }
  );

export const SalvarSosSchema = z.object({
  beneficiario: z.string().optional(),
  motivo: z.string().optional(),
  itens: z.array(ItemSosSchema).min(1, 'Adicione pelo menos um item'),
});

export type ItemSosDto = z.infer<typeof ItemSosSchema>;
export type ListarSosDto = z.infer<typeof ListarSosSchema>;
export type ObterEstatisticasSosDto = z.infer<
  typeof ObterEstatisticasSosSchema
>;
export type SalvarSosDto = z.infer<typeof SalvarSosSchema>;
