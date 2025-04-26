'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DoacoesLista } from './DoacoesLista';

export function DoacoesListaContainer() {
  const [filtersVisible, setFiltersVisible] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          {filtersVisible ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>
      </div>

      <DoacoesLista filtersVisible={filtersVisible} />
    </div>
  );
}
