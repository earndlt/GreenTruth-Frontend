
import { useState } from 'react';
import { EacData } from '../../purchase/types';

export const useEacPurchase = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEac, setSelectedEac] = useState<EacData | null>(null);
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handlePurchase = (eac: any) => {
    // Determine the commodity type for correct unit handling
    const isMethanol = eac.type.toLowerCase().includes('methanol');
    
    // Convert the eac to the format needed by PurchaseEacDialog
    const eacData: EacData = {
      id: eac.id,
      producer: eac.vendor,
      deliveryPoint: eac.deliveryPoint,
      price: eac.price,
      availableVolume: eac.availableVolume,
      status: eac.status,
      energySource: eac.energySource,
      // Add the missing required properties for EacData type
      certType: isMethanol ? 'Methanol' : eac.type || 'Standard',
      available: eac.availableVolume || 0,
      vintage: eac.date || 'Current',
      organizationId: eac.organizationId,
      profileId: eac.profileId,
      profileWalletId: eac.profileWalletId
    };

    setSelectedEac(eacData);
    setDialogOpen(true);
    console.log("dialog opened", eacData)
  };

  return {
    dialogOpen,
    selectedEac,
    setDialogOpen,
    handleCloseDialog,
    handlePurchase
  };
};
