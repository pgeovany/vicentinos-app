import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const OptionalField = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-medium">{label}</span>
    <span>{value || '—'}</span>
  </div>
);

export const OptionalDate = ({ label, date }: { label: string; date?: string | Date | null }) => (
  <OptionalField
    label={label}
    value={date ? format(new Date(date), 'dd/MM/yyyy', { locale: ptBR }) : undefined}
  />
);
