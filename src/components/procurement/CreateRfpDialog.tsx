
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import RfpDialogContent from './RfpDialogContent';
import RfpDrawerContent from './RfpDrawerContent';

const CreateRfpDialog = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <RfpDialogContent open={open} setOpen={setOpen}>
        {children}
      </RfpDialogContent>
    );
  }

  return (
    <RfpDrawerContent open={open} setOpen={setOpen}>
      {children}
    </RfpDrawerContent>
  );
};

export default CreateRfpDialog;
