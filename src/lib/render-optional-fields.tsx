import { formatDate } from './format-date';

export const renderOptionalField = (value: string | undefined | null, label: string) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    {(() => {
      let displayValue: string;
      if (value) {
        displayValue = value !== '' ? value : 'Não informado';
      } else {
        displayValue = 'Não informado';
      }
      return <p>{displayValue}</p>;
    })()}
  </div>
);

export const renderOptionalDate = (date: Date | null | undefined, label: string) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p>{date ? formatDate(date) : 'Não informado'}</p>
  </div>
);
