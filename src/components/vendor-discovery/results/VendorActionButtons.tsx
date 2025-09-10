
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, SendIcon } from 'lucide-react';

interface VendorActionButtonsProps {
  selectedCount: number;
  onSendRfi: () => void;
  onCreateRfp: () => void;
  companyName?: string;
}

const VendorActionButtons: React.FC<VendorActionButtonsProps> = ({
  selectedCount,
  onSendRfi,
  onCreateRfp,
  companyName
}) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onSendRfi}
        disabled={selectedCount === 0}
      >
        <SendIcon className="h-4 w-4 mr-2" />
        Send RFI {companyName ? `from ${companyName}` : ''}
      </Button>
      <Button 
        size="sm"
        onClick={onCreateRfp}
        disabled={selectedCount === 0}
      >
        <FileText className="h-4 w-4 mr-2" />
        Create RFP
      </Button>
    </div>
  );
};

export default VendorActionButtons;
