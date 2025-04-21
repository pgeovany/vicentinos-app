import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
const cepRegex = /^\d{5}-\d{3}$/;

export const dependenteBeneficiarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido').optional(),
  dataNascimento: z.coerce.date().optional(),
  telefone: z.string().regex(phoneRegex, 'Telefone inválido').optional(),
  email: z.string().email('Email inválido').optional(),
  parentesco: z.string().optional(),
});

export const criarBeneficiarioSchema = z.object({
  beneficiarioId: z.string().optional(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido').optional(),
  rg: z.string().optional(),
  dataNascimento: z.coerce.date().optional(),
  telefone: z.string().regex(phoneRegex, 'Telefone inválido').optional(),
  email: z.string().email('Email inválido').optional(),
});

export const adicionarDependentesSchema = z.object({
  dependentes: z.array(dependenteBeneficiarioSchema),
});

export const atualizarEnderecoSchema = z.object({
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  cep: z.string().regex(cepRegex, 'CEP inválido').optional(),
});

export const atualizarTipoCestaSchema = z.object({
  tipoCestaId: z.string().min(1, 'ID do tipo de cesta é obrigatório'),
});

export const listarBeneficiariosSchema = z.object({
  nome: z.string().optional(),
  tipoCestaId: z.string().optional(),
  pagina: z.number().int().positive().optional(),
  quantidade: z.number().int().positive().optional(),
});

export type CriarBeneficiarioDto = z.infer<typeof criarBeneficiarioSchema>;
export type DependenteBeneficiarioDto = z.infer<typeof dependenteBeneficiarioSchema>;
export type AdicionarDependentesDto = z.infer<typeof adicionarDependentesSchema>;
export type AtualizarEnderecoDto = z.infer<typeof atualizarEnderecoSchema>;
export type AtualizarTipoCestaDto = z.infer<typeof atualizarTipoCestaSchema>;
export type ListarBeneficiariosDto = z.infer<typeof listarBeneficiariosSchema>;
