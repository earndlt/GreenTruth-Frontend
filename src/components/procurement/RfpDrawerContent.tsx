
import React from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RfpFormContent from './RfpFormContent';
import { RfpFormProvider } from './context/RfpFormContext';

interface RfpDrawerContentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
}

const RfpDrawerContent: React.FC<RfpDrawerContentProps> = ({ 
  open, 
  setOpen, 
  children 
}) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New RFP
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Create New RFP</DrawerTitle>
          <DrawerDescription>
            Let AI help you build a comprehensive RFP with environmental attributes.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 overflow-y-auto pb-4">
          <RfpFormProvider onClose={() => setOpen(false)}>
            <RfpFormContent />
          </RfpFormProvider>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RfpDrawerContent;
