'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { obterDadosTransparencia } from '../../actions';
import { DadosTransparencia } from '@/api/transparencia/types';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Users, Bell, ShoppingBag } from 'lucide-react';

export function EstatisticasTransparencia() {
  const [dados, setDados] = useState<DadosTransparencia | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true);
      try {
        const response = await obterDadosTransparencia();

        if (response.success) {
          setDados(response.data);
        } else {
          toast.error(response.error || 'Erro ao carregar dados de transparência');
        }
      } catch (error) {
        console.error('Erro ao buscar dados de transparência:', error);
        toast.error('Não foi possível carregar os dados de transparência');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDados();
  }, []);

  const renderStatCard = (
    title: string,
    value: number | string,
    icon: React.ReactNode,
    color: string,
  ) => (
    <Card
      className={`p-4 shadow-md border-l-4 ${color} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center">
        <div
          className="mr-4 p-2 rounded-full bg-opacity-20"
          style={{ backgroundColor: `${color.replace('border-l-', 'rgb(')}` }}
        >
          {icon}
        </div>
        <div>
          <p className="text-gray-600 font-medium">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  );

  const generateImpactText = () => {
    if (!dados) return '';

    return `Em ${dados.mes} de ${dados.ano}, recebemos ${dados.totalAlimentosRecebidos} quilos de alimentos e fomos capazes de ajudar ${dados.familiasBeneficiadas} famílias. Além disso, realizamos ${dados.atendimentosEmergenciais} atendimentos emergenciais para pessoas em situação de vulnerabilidade imediata.`;
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-blue-600 animate-pulse font-medium">
          Carregando dados de transparência...
        </p>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-medium">
          Não foi possível carregar os dados de transparência.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-3">Transparência</h1>
        <p className="text-lg text-blue-600 max-w-xl mx-auto">
          Conheça o impacto da sua generosidade em nossa comunidade
        </p>
      </div>

      {/* Impact Summary Card */}
      <Card className="p-6 bg-gradient-to-br from-orange-100 to-amber-50 border-orange-200 shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:mr-6 mb-4 md:mb-0">
            <Image src="/favicon.ico" alt="Favicon" width={64} height={64} />
          </div>
          <div>
            <p className="text-center md:text-left text-lg font-medium text-blue-900">
              {generateImpactText()}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {renderStatCard(
          'Famílias assistidas',
          dados.familiasCadastradas,
          <Users className="h-6 w-6 text-blue-600" />,
          'border-l-blue-500',
        )}

        {renderStatCard(
          'Atendimentos emergenciais',
          dados.atendimentosEmergenciais,
          <Bell className="h-6 w-6 text-red-600" />,
          'border-l-red-500',
        )}

        {renderStatCard(
          'Alimentos recebidos (kg)',
          `${dados.totalAlimentosRecebidos} kg`,
          <ShoppingBag className="h-6 w-6 text-green-600" />,
          'border-l-green-500',
        )}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg text-white text-center shadow-lg">
        <h2 className="text-xl font-bold mb-3">Sua contribuição faz toda a diferença</h2>
        <p className="mb-6">
          Cada doação, por menor que seja, ajuda a transformar vidas e levar esperança para famílias
          em situação de vulnerabilidade. Junte-se a nós nesta missão de caridade!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/transparencia/produtos">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-300 w-full sm:w-auto cursor-pointer">
              Ver produtos necessários
            </button>
          </a>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-blue-600 font-medium">
          {`"... Em verdade vos digo: cada vez que ajudastes a um desses meus irmãos mais pequeninos, a mim o fizestes."`}
        </p>
        <p className="text-gray-500 mt-2 italic">- Mateus 25:40</p>
      </div>
    </div>
  );
}
