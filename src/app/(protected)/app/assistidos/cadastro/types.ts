export type DependentFormData = {
  nome: string;
  dataNascimento: string;
  parentesco: string;
};

export type BeneficiarioFormData = {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  complemento: string;
  dependentes: DependentFormData[];
  tipoCestaId: string;
};
