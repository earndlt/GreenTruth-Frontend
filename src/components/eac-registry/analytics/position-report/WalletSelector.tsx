
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Wallet {
  id: string;
  name: string;
}

interface WalletSelectorProps {
  availableWallets: Wallet[];
  selectedWallets: string[];
  onWalletSelectionChange: (walletId: string) => void;
  onSelectAllWallets: () => void;
}

const WalletSelector = ({ 
  availableWallets, 
  selectedWallets, 
  onWalletSelectionChange, 
  onSelectAllWallets 
}: WalletSelectorProps) => {
  return (
    <div className="space-y-2 flex-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Select Wallets</p>
        <Button 
          variant="link" 
          className="text-xs h-auto p-0"
          onClick={onSelectAllWallets}
        >
          {selectedWallets.length === availableWallets.length ? 'Deselect All' : 'Select All'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border rounded-md">
        {availableWallets.map(wallet => (
          <div key={wallet.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`wallet-${wallet.id}`} 
              checked={selectedWallets.includes(wallet.id)}
              onCheckedChange={() => onWalletSelectionChange(wallet.id)}
            />
            <label 
              htmlFor={`wallet-${wallet.id}`}
              className="text-sm whitespace-nowrap"
            >
              {wallet.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletSelector;
