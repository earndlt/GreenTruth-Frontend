
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface UsageAlertProps {
  readUsagePercentage: number;
  writeUsagePercentage: number;
  readHighUsage: boolean;
  writeHighUsage: boolean;
}

const UsageAlert: React.FC<UsageAlertProps> = ({
  readUsagePercentage,
  writeUsagePercentage,
  readHighUsage,
  writeHighUsage
}) => {
  const showAlert = readHighUsage || writeHighUsage;
  const highDanger = readUsagePercentage > 90 || writeUsagePercentage > 90;
  
  if (!showAlert) return null;
  
  return (
    <Alert 
      className="mt-4" 
      variant={highDanger ? "destructive" : "default"}
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Usage Alert</AlertTitle>
      <AlertDescription>
        {readHighUsage && writeHighUsage ? (
          <>
            You've used {readUsagePercentage.toFixed(1)}% of your reading allocation and {writeUsagePercentage.toFixed(1)}% of your writing allocation.
          </>
        ) : readHighUsage ? (
          <>You've used {readUsagePercentage.toFixed(1)}% of your reading allocation.</>
        ) : (
          <>You've used {writeUsagePercentage.toFixed(1)}% of your writing allocation.</>
        )}
        {highDanger && " Overages will be billed automatically."}
      </AlertDescription>
    </Alert>
  );
};

export default UsageAlert;
