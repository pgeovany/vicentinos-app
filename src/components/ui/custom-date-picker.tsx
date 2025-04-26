'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
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

  // Generate years for dropdown
  const years = React.useMemo(() => {
    const yearOptions = [];
    for (let year = toYear; year >= fromYear; year--) {
      yearOptions.push(year);
    }
    return yearOptions;
  }, [fromYear, toYear]);

  // Generate months for dropdown
  const months = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = new Date(0, i);
      return {
        value: i,
        label: month.toLocaleString('pt-BR', { month: 'long' }),
      };
    });
  }, []);

  // Get current view state
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  // Update calendar view when month/year changes
  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

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
        <div className="px-3 py-2 border-b flex justify-between">
          <div className="flex gap-2 w-full">
            <select
              className="flex-1 cursor-pointer rounded-md border border-input bg-background p-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
              value={currentMonth}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              aria-label="Mês"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
                </option>
              ))}
            </select>

            <select
              className="w-24 cursor-pointer rounded-md border border-input bg-background p-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              aria-label="Ano"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={handleDateSelect}
          initialFocus
          locale={ptBR}
          month={new Date(currentYear, currentMonth)}
          onMonthChange={(newMonth) => {
            setCurrentMonth(newMonth.getMonth());
            setCurrentYear(newMonth.getFullYear());
          }}
          disabled={() => false}
        />
      </PopoverContent>
    </Popover>
  );
}
