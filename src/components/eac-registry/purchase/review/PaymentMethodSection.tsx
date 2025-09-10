import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Landmark, CheckCircle } from 'lucide-react';

interface PaymentMethod {
  type: string;
  last4?: string;
  expiry?: string;
  bankName?: string;
  accountLast4?: string;
  isPlaidVerified?: boolean;
  institutionName?: string;
}

interface PaymentMethodSectionProps {
  primaryPaymentMethod: PaymentMethod;
  navigateToPaymentSettings: () => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({ 
  primaryPaymentMethod, 
  navigateToPaymentSettings 
}) => {
  return (
    <div className="border-b pb-3">
      <p className="font-medium mb-2">Payment Method:</p>
      <div className="bg-gray-50 p-2 rounded flex items-start">
        {primaryPaymentMethod.type === 'credit-card' ? (
          <CreditCard className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
        ) : (
          <Landmark className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
        )}
        <div className="flex-1">
          {primaryPaymentMethod.type === 'credit-card' ? (
            <p>Credit Card •••• {primaryPaymentMethod.last4}</p>
          ) : primaryPaymentMethod.isPlaidVerified ? (
            <div className="flex items-center">
              <p>{primaryPaymentMethod.institutionName} •••• {primaryPaymentMethod.accountLast4}</p>
              <span className="ml-2 inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                <CheckCircle className="h-3 w-3 mr-1" />
                Plaid Verified
              </span>
            </div>
          ) : (
            <p>ACH/Wire Transfer ({primaryPaymentMethod.bankName})</p>
          )}
          <p className="text-sm text-gray-500">
            Primary payment method from Transaction Payments
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={navigateToPaymentSettings}
            >
              Edit
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSection;
