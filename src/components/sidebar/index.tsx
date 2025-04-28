'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  // LayoutDashboard,
  Users,
  Package,
  ShoppingBasket,
  HeartHandshake,
  AlertTriangle,
  ChevronDown,
  History,
  Settings,
  List,
  Box,
  UserPlus,
  PackagePlus,
  PackageCheck,
  BarChart3,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppSideBarMenuItem } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const toggleMenu = (menuId: string) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  const menuConfig: AppSideBarMenuItem[] = [
    // {
    //   id: 'painel',
    //   label: 'Painel',
    //   Icon: LayoutDashboard,
    //   subItems: [{ label: 'Este mês', Icon: BarChart3, path: '/app/painel/dashboard' }],
    // },
    {
      id: 'assistidos',
      label: 'Assistidos',
      Icon: Users,
      subItems: [
        { label: 'Lista', Icon: List, path: '/app/assistidos/lista' },
        { label: 'Cadastro', Icon: UserPlus, path: '/app/assistidos/cadastro' },
      ],
    },
    {
      id: 'produtos',
      label: 'Produtos',
      Icon: Package,
      subItems: [
        { label: 'Lista', Icon: List, path: '/app/produtos/lista' },
        { label: 'Estoque', Icon: Box, path: '/app/produtos/estoque' },
        {
          label: 'Movimentações',
          Icon: PackageCheck,
          path: '/app/produtos/movimentacoes',
        },
      ],
    },
    {
      id: 'cestas',
      label: 'Cestas',
      Icon: ShoppingBasket,
      subItems: [
        {
          label: 'Distribuição',
          Icon: PackagePlus,
          path: '/app/cestas/distribuicao',
        },
        { label: 'Histórico', Icon: History, path: '/app/cestas/historico' },
        { label: 'Configuração', Icon: Settings, path: '/app/cestas/configuracao' },
      ],
    },
    {
      id: 'doacoes',
      label: 'Doações',
      Icon: HeartHandshake,
      subItems: [
        { label: 'Histórico', Icon: History, path: '/app/doacoes/listar' },
        {
          label: 'Estatísticas',
          Icon: BarChart3,
          path: '/app/doacoes/estatisticas',
        },
      ],
    },
    {
      id: 'sos',
      label: 'SOS',
      Icon: AlertTriangle,
      subItems: [
        { label: 'Histórico', Icon: History, path: '/app/sos/listar' },
        { label: 'Estatísticas', Icon: BarChart3, path: '/app/sos/estatisticas' },
      ],
    },
  ];

  useEffect(() => {
    const activeMenu = menuConfig.find((menu) => menu.subItems.some((sub) => isActive(sub.path)));
    if (activeMenu) {
      setOpenMenu(activeMenu.id);
    } else {
      setOpenMenu(null);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarMenu>
          {menuConfig.map((menu) => (
            <SidebarMenuItem key={menu.id}>
              <SidebarMenuSub className="border-l-0">
                <SidebarMenuButton onClick={() => toggleMenu(menu.id)} className="cursor-pointer">
                  <menu.Icon className="w-5 h-5" />
                  <span>{menu.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform ${
                      openMenu === menu.id ? 'rotate-180' : ''
                    }`}
                  />
                </SidebarMenuButton>
                {openMenu === menu.id && (
                  <SidebarMenuSub className="border-l-0">
                    {menu.subItems.map((sub) => (
                      <SidebarMenuSubItem key={sub.path}>
                        <SidebarMenuSubButton
                          onClick={() => handleNavigation(sub.path)}
                          className={`cursor-pointer ${isActive(sub.path) ? 'bg-accent' : ''}`}
                        >
                          <sub.Icon className="w-4 h-4" />
                          <span>{sub.label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuSub>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
