import { formatDate } from './format-date';

export const renderOptionalField = (value: string | undefined | null, label: string) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p>{value ?? 'Não informado'}</p>
  </div>
);

export const renderOptionalDate = (date: Date | undefined | null, label: string) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p>{date ? formatDate(new Date(date)) : 'Não informado'}</p>
  </div>
);
