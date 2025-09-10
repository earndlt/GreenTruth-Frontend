
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface TransactionSuccessStepProps {
  transactionId: string;
  transactionType: string;
  navigateToDashboard: () => void;
}

const TransactionSuccessStep: React.FC<TransactionSuccessStepProps> = ({
  transactionId,
  transactionType,
  navigateToDashboard
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="bg-green-100 rounded-full p-3 mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Transaction Successful!</h2>
      <p className="text-gray-600 mb-6">
        Your {transactionType === 'spot' ? 'spot purchase' : 'forward contract'} has been successfully processed
      </p>
      
      <div className="bg-gray-50 p-4 rounded-md w-full mb-6 text-left">
        <div className="mb-2">
          <span className="text-sm text-gray-500">Transaction ID:</span>
          <p className="font-medium">{transactionId}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Status:</span>
          <p className="font-medium text-green-600">Confirmed</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-8">
        {transactionType === 'spot' 
          ? 'The EACs will be delivered to your wallet shortly.' 
          : 'The first batch of EACs will be delivered according to your selected schedule.'}
      </p>
      
      <DialogFooter className="w-full">
        <Button 
          onClick={navigateToDashboard} 
          className="w-full"
          data-test-id="view-transaction-details-button"
        >
          View Transaction Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TransactionSuccessStep;
