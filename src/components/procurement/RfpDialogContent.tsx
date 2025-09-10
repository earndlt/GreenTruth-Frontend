
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RfpFormContent from './RfpFormContent';
import { RfpFormProvider } from './context/RfpFormContext';

interface RfpDialogContentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
}

const RfpDialogContent: React.FC<RfpDialogContentProps> = ({ 
  open, 
  setOpen, 
  children 
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New RFP
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New RFP</DialogTitle>
          <DialogDescription>
            Let AI help you build a comprehensive RFP with environmental attributes.
          </DialogDescription>
        </DialogHeader>
        
        <RfpFormProvider onClose={() => setOpen(false)}>
          <RfpFormContent />
        </RfpFormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RfpDialogContent;
