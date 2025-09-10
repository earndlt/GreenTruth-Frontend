
import { LucideIcon } from 'lucide-react';

export type WalletEntity = {
  id: string;
  name: string;
  walletId: string;
  division?: string; // Added as optional property
  holdings: {
    name: string;
    amount: number;
    unit: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
  }[];
};
