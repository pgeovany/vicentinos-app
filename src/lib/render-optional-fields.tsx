import { formatDate } from './format-date';

export const renderOptionalField = (value: string | undefined | null, label: string) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p>{value ?? 'Não informado'}</p>
  </div>
);

export const renderOptionalDate = (date: Date | null | undefined, label: string) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p>{date ? formatDate(date) : 'Não informado'}</p>
  </div>
);
