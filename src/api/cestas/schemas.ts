import { z } from 'zod';

const ProdutoCestaSchema = z.object({
  produtoId: z.string().min(1),
  quantidade: z.number().int().min(1),
});

export const AdicionarProdutosCestaSchema = z.object({
  produtos: z.array(ProdutoCestaSchema).min(1),
});

export const CriarCestaSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
});

export const ListarDistribuicoesPendentesSchema = z.object({
  nome: z.string().optional(),
  pagina: z.string().optional().default('1'),
  quantidade: z.string().optional().default('15'),
});

export const ListarHistoricoDistribuicoesSchema = z.object({
  nome: z.string().optional(),
  tipoCestaId: z.string().optional(),
  mes: z.string().min(0, { message: 'Mês é obrigatório' }),
  ano: z.string().min(4, { message: 'Ano é obrigatório' }),
  pagina: z.string().optional().default('1'),
  quantidade: z.string().optional().default('15'),
});

export type AdicionarProdutosCestaDto = z.infer<typeof AdicionarProdutosCestaSchema>;
export type CriarCestaDto = z.infer<typeof CriarCestaSchema>;
export type ListarDistribuicoesPendentesDto = z.infer<typeof ListarDistribuicoesPendentesSchema>;
export type ListarHistoricoDistribuicoesDto = z.infer<typeof ListarHistoricoDistribuicoesSchema>;
