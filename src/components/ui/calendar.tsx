'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ ...props }: CalendarProps) {
  return (
    <DayPicker
      style={{ '--rdp-accent-color': '#000' } as React.CSSProperties}
      locale={ptBR}
      className="rounded-lg shadow border overflow-hidden"
      classNames={{
        // caption: 'bg-gray-50 py-2 rounded-t text-center',
        caption: 'flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 rounded-t',
        caption_label: 'font-semibold text-md gap-2 py-2 px-3',
      }}
      {...props}
    />
  );
}

export { Calendar };
