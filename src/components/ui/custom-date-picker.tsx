'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  readonly date: Date | undefined;
  readonly onSelect: (date: Date | undefined) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly fromYear?: number;
  readonly toYear?: number;
  readonly required?: boolean;
}

export function CustomDatePicker({
  date,
  onSelect,
  placeholder = 'Selecionar data',
  className,
  disabled = false,
  id,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
  required = false,
}: DatePickerProps) {
  // This function creates a date without timezone issues
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onSelect(undefined);
      return;
    }

    // Create a date at noon UTC to avoid timezone offset issues
    const correctedDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        12,
        0,
        0,
      ),
    );

    onSelect(correctedDate);
  };

  // Format display date correctly
  const displayDate = React.useMemo(() => {
    if (!date) return undefined;

    // For display purposes, ensure we see the actual selected date regardless of timezone
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal cursor-pointer',
            !date && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {date ? format(displayDate || date, 'dd/MM/yyyy') : placeholder}
          </span>
          {required && !date && <span className="text-destructive ml-1 flex-shrink-0">*</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={handleDateSelect}
          initialFocus
          locale={ptBR}
          captionLayout="dropdown-buttons"
          fromYear={fromYear}
          toYear={toYear}
          classNames={{
            caption_label: 'hidden',
            nav_button_previous: 'ml-1',
            nav_button_next: 'mr-1',
            caption: 'flex justify-center pt-1 pb-2 relative items-center',
            dropdown_month: 'w-full text-center [&>span]:mx-auto [&>span]:text-sm',
            dropdown_year: 'w-full text-center [&>span]:mx-auto [&>span]:text-sm',
          }}
          formatters={{
            formatCaption: (date) => {
              const month = date.toLocaleString('pt-BR', { month: 'long' });
              const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
              const year = date.getFullYear();
              return `${capitalizedMonth} de ${year}`;
            },
          }}
          components={{
            Dropdown: ({ value, onChange, ...props }) => {
              const label = props.name === 'month' ? 'Mês' : 'Ano';
              return (
                <select
                  value={value}
                  onChange={onChange}
                  {...props}
                  className="w-full cursor-pointer rounded-md border border-input bg-background p-1 text-sm outline-none focus:ring-1 focus:ring-ring"
                  aria-label={label}
                >
                  {props.children}
                </select>
              );
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
