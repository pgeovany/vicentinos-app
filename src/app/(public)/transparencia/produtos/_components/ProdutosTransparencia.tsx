'use client';

import { listaProdutosTransparencia } from '../../actions';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

export function ProdutosTransparencia() {
  const [produtos, setProdutos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCopyPixKey = () => {
    const pixKey = 'conceicao.pavuna@arqrio.org.br';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(pixKey)
        .then(() => {
          toast.success('Chave PIX copiada com sucesso!');
        })
        .catch(() => {
          fallbackCopyToClipboard(pixKey);
        });
    } else {
      fallbackCopyToClipboard(pixKey);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);

      if (navigator.userAgent.match(/ipad|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        toast.success('Chave PIX copiada com sucesso!');
      } else {
        toast.error('Não foi possível copiar a chave PIX');
      }
    } catch (err) {
      toast.error('Não foi possível copiar a chave PIX');
      console.error('Erro ao copiar:', err);
    }
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      setIsLoading(true);
      try {
        const response = await listaProdutosTransparencia();

        if (response.success) {
          setProdutos(response.data?.produtos || []);
        } else {
          toast.error(response.error || 'Erro ao carregar produtos');
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        toast.error('Não foi possível carregar a lista de produtos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const renderProductList = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <p className="text-blue-600 animate-pulse font-medium">Carregando produtos...</p>
        </div>
      );
    }

    if (produtos.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-blue-600 font-medium">Não há produtos cadastrados no momento.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {produtos.map((produto, index) => (
          <Card
            key={produto}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500"
          >
            <div className="p-4 flex items-center bg-gradient-to-r from-blue-50 to-white">
              <div className="flex-shrink-0 flex items-center justify-center bg-orange-500 text-white rounded-full w-10 h-10 mr-4 shadow-md">
                {index + 1}
              </div>
              <div className="w-full">
                <span className="font-semibold text-blue-800">{produto}</span>
                <div className="mt-1 bg-gray-200 h-2 rounded-full overflow-hidden w-full">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full"
                    style={{
                      width: `${Math.max(50, 100 - index * (50 / Math.max(1, produtos.length - 1)))}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Nível de necessidade</span>
                  <span
                    className={`font-medium ${index < 3 ? 'text-orange-600' : 'text-gray-600'}`}
                  >
                    {(() => {
                      if (index === 0) return 'Urgente';
                      if (index < 3) return 'Alta';
                      if (index < 6) return 'Média';
                      return 'Regular';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-3">
          Sua doação transforma vidas
        </h1>
        <p className="text-lg text-blue-600 max-w-xl mx-auto">
          Ajude-nos a ajudar quem mais precisa. Cada item doado representa esperança para uma
          família em necessidade.
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-orange-100 to-amber-50 border-orange-200 shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* <div className="md:mr-6 mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div> */}
          <div className="md:mr-6 mb-4 md:mb-0">
            <Image src="/favicon.ico" alt="Favicon" width={64} height={64} />
          </div>
          <div>
            <p className="text-center md:text-left text-lg font-medium text-blue-900">
              Estes são os{' '}
              <span className="font-bold underline decoration-orange-500">
                produtos que mais necessitamos
              </span>{' '}
              no momento. Sua ajuda é fundamental para proporcionar conforto e dignidade às famílias
              assistidas!
            </p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-lg border-t-4 border-blue-600">
        <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-xl text-center">
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Produtos mais necessários
          </div>
        </div>
        {renderProductList()}
      </Card>

      <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg text-white text-center shadow-lg">
        <h2 className="text-xl font-bold mb-3">Como posso doar?</h2>

        {/* Presencial section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Presencialmente</h3>
          <p className="mb-2">
            Para doar, basta levar os alimentos até a paróquia Nossa Senhora da Conceição e procurar
            os Vicentinos (ou a secretaria).
          </p>
          <p className="mb-4">
            Endereço: Praça Srg. Fábio Pavani, 44 - Pavuna, Rio de Janeiro - RJ, 21525-680
          </p>
          <a
            href="https://maps.app.goo.gl/4HpUxzEYGMh2FmxCA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-300 cursor-pointer">
              Ver no mapa
            </button>
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-blue-400">
          <h3 className="text-lg font-semibold mb-2">Contribuição via PIX</h3>
          <div className="bg-white/10 p-4 rounded-lg mb-4 mx-auto max-w-md">
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-yellow-300 mb-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v16M7 8h10" />
              </svg>
              <p className="text-sm mb-1">Paróquia Nossa Senhora da Conceição</p>
              <p className="text-sm mb-1">Banco Bradesco</p>
              <p className="text-sm mb-3">Chave PIX: conceicao.pavuna@arqrio.org.br</p>
              <button
                onClick={handleCopyPixKey}
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-300 flex items-center cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copiar chave PIX
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-blue-600 font-medium">
          Obrigado por ajudar! Cada doação, por menor que seja, faz uma grande diferença na vida das
          pessoas que assistimos.
        </p>
        <div className="flex justify-center mt-2 space-x-1">
          {[1, 2, 3, 4, 5].map((starId) => (
            <svg
              key={`star-${starId}`}
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-orange-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}
