
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AchForm from './AchForm';
import CreditCardForm from './CreditCardForm';

interface AddPaymentMethodProps {
  currentMethodType: 'ach' | 'creditCard';
  setCurrentMethodType: (type: 'ach' | 'creditCard') => void;
  bankName: string;
  setBankName: (value: string) => void;
  accountName: string;
  setAccountName: (value: string) => void;
  routingNumber: string;
  setRoutingNumber: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  nameOnCard: string;
  setNameOnCard: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  isVerifying: boolean;
  onAddPaymentMethod: () => void;
  // New Plaid props
  plaidLinkToken?: string | null;
  onPlaidSuccess?: (publicToken: string, metadata: any) => void;
  onPlaidExit?: () => void;
  isPlaidLoading?: boolean;
}

const AddPaymentMethod: React.FC<AddPaymentMethodProps> = ({
  currentMethodType,
  setCurrentMethodType,
  bankName,
  setBankName,
  accountName,
  setAccountName,
  routingNumber,
  setRoutingNumber,
  accountNumber,
  setAccountNumber,
  nameOnCard,
  setNameOnCard,
  cardNumber,
  setCardNumber,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  isVerifying,
  onAddPaymentMethod,
  // New Plaid props
  plaidLinkToken,
  onPlaidSuccess,
  onPlaidExit,
  isPlaidLoading
}) => {
  return (
    <div className="pt-3 border-t">
      <h3 className="text-lg font-medium mb-4">Add Payment Method</h3>
      
      <Tabs 
        defaultValue="ach" 
        onValueChange={(value) => setCurrentMethodType(value as 'ach' | 'creditCard')}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="ach">ACH / Wire Transfer</TabsTrigger>
          <TabsTrigger value="creditCard">Credit Card</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ach">
          <AchForm 
            bankName={bankName}
            setBankName={setBankName}
            accountName={accountName}
            setAccountName={setAccountName}
            routingNumber={routingNumber}
            setRoutingNumber={setRoutingNumber}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            plaidLinkToken={plaidLinkToken}
            onPlaidSuccess={onPlaidSuccess}
            onPlaidExit={onPlaidExit}
            isPlaidLoading={isPlaidLoading}
          />
        </TabsContent>
        
        <TabsContent value="creditCard">
          <CreditCardForm 
            nameOnCard={nameOnCard}
            setNameOnCard={setNameOnCard}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            cvv={cvv}
            setCvv={setCvv}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          onClick={onAddPaymentMethod} 
          disabled={isVerifying}
          className="w-full sm:w-auto"
        >
          {isVerifying ? (
            "Processing..."
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Payment Method
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddPaymentMethod;
