
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, CreditCard } from 'lucide-react';

interface TransactionAlertsProps {
  transactionType: string;
  paymentMethodType: string;
  pricePerDelivery: string;
}

const TransactionAlerts: React.FC<TransactionAlertsProps> = ({ 
  transactionType, 
  paymentMethodType,
  pricePerDelivery
}) => {
  if (transactionType !== 'forward') {
    return null;
  }

  return (
    <>
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 text-sm">
          Gas flows continuously throughout the entire contract period. EAC tokens representing this gas flow will be delivered to your wallet in monthly batches within 60 days of the physical molecules received.
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-amber-50 border-amber-200">
        <CreditCard className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-700 text-sm font-medium">
          Payment Notice: Funds will be collected via your {paymentMethodType === 'credit-card' ? 'Credit Card' : 'ACH/Wire Transfer'} upon each monthly token delivery. Each delivery will cost approximately ${pricePerDelivery}.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default TransactionAlerts;
