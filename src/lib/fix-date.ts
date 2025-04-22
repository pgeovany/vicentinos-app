export function ensureCorrectDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';

  if (dateInput instanceof Date) {
    return dateInput.toISOString().split('T')[0];
  }

  if (typeof dateInput === 'string' && dateInput.length === 10) {
    return new Date(`${dateInput}T12:00:00Z`).toISOString().split('T')[0];
  }

  const date = new Date(dateInput);
  return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
}

export function toLocalIsoMidnight(yyyyMmDd: string): Date {
  return `${yyyyMmDd}T00:00:00.000` as unknown as Date;
}
