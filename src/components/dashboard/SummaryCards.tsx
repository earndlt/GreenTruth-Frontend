
import React, { useState } from 'react';
import { corporateWallets } from '@/data/corporateWallets';
import EacRegistryCard from '@/components/dashboard/cards/EacRegistryCard';
import ProcurementStatusCard from '@/components/dashboard/cards/ProcurementStatusCard';

const SummaryCards = () => {
  const [selectedWallet, setSelectedWallet] = useState(corporateWallets[0]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <EacRegistryCard 
          corporateWallets={corporateWallets}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
        />
      </div>
      <div className="lg:col-span-1">
        <ProcurementStatusCard />
      </div>
    </div>
  );
};

export default SummaryCards;

