'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovimentacoesDetalhadas } from './MovimentacoesDetalhadas';
import { MovimentacoesTotais } from './MovimentacoesTotais';

const TABS = {
  DETALHADO: 'detalhado',
  TOTAIS: 'totais',
};

export function ProdutoMovimentacoes() {
  const [activeTab, setActiveTab] = useState(TABS.TOTAIS);
  const [filtersVisible, setFiltersVisible] = useState(false);

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === TABS.TOTAIS
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(TABS.TOTAIS)}
          >
            Totais por produto
          </button>
          <button
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === TABS.DETALHADO
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(TABS.DETALHADO)}
          >
            Movimentações detalhadas
          </button>
        </nav>
      </div>

      {activeTab === TABS.DETALHADO && (
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
      )}

      {activeTab === TABS.DETALHADO ? (
        <MovimentacoesDetalhadas filtersVisible={filtersVisible} />
      ) : (
        <MovimentacoesTotais />
      )}
    </div>
  );
}
