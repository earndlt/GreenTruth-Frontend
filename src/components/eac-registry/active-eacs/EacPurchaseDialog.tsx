
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import PurchaseEacDialog from '../PurchaseEacDialog';
import { EacData } from '../purchase/types';

interface EacPurchaseDialogProps {
  selectedEac: EacData | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  handleCloseDialog: () => void;
}

const EacPurchaseDialog: React.FC<EacPurchaseDialogProps> = ({
  selectedEac,
  dialogOpen,
  setDialogOpen,
  handleCloseDialog,
}) => {
  return (
    selectedEac && (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <PurchaseEacDialog 
          eacData={selectedEac} 
          onClose={handleCloseDialog}
        />
      </Dialog>
    )
  );
};

export default EacPurchaseDialog;
