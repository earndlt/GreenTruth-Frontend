
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PrivacyAlert = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Confidential information handling</AlertTitle>
      <AlertDescription>
        Documents uploaded will only be used to help our AI understand your business context. All content is treated as confidential.
      </AlertDescription>
    </Alert>
  );
};

export default PrivacyAlert;
