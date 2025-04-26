import { ENUM_RECEBIMENTO_DOACAO_ORIGEM } from '@/api/doacoes/types';

export const ORIGEM_ENUM_MAP_TO_LABEL = {
  [ENUM_RECEBIMENTO_DOACAO_ORIGEM.MISSA_DOMINGO]: 'Missas de domingo',
  [ENUM_RECEBIMENTO_DOACAO_ORIGEM.MISSA_SABADO]: 'Missa de sábado',
  [ENUM_RECEBIMENTO_DOACAO_ORIGEM.MISSA_SEMANA]: 'Missa de semana',
  [ENUM_RECEBIMENTO_DOACAO_ORIGEM.CAMPANHA]: 'Campanha',
  [ENUM_RECEBIMENTO_DOACAO_ORIGEM.PONTUAL]: 'Pontual',
  [ENUM_RECEBIMENTO_DOACAO_ORIGEM.OUTROS]: 'Outros',
};

export function getOrigemDoacaoLabel(origem: ENUM_RECEBIMENTO_DOACAO_ORIGEM | string): string {
  return ORIGEM_ENUM_MAP_TO_LABEL[origem as keyof typeof ORIGEM_ENUM_MAP_TO_LABEL] ?? 'Outros';
}
