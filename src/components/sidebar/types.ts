import { LucideIcon } from 'lucide-react';

interface SubItem {
  label: string;
  Icon: LucideIcon;
  path: string;
}

export interface AppSideBarMenuItem {
  id: string;
  label: string;
  Icon: LucideIcon;
  subItems: SubItem[];
}
