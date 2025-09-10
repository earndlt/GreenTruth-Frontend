
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Company } from '../../CompanySelector';
import { MatchedEAC } from '../types';

export const useTransactionFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInitiateTransaction = () => {
    setCurrentStep(2);
  };
  
  const handleConfirmTransaction = async (
    selectedCompany: Company | null, 
    matchedEACs: MatchedEAC[],
    transactionType: "spot" | "forward"
  ) => {
    if (!selectedCompany) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/eac-registry', {
        state: {
          activeTab: 'transactions',
          transactionData: {
            eacs: matchedEACs,
            company: selectedCompany,
            orderType: transactionType,
            isKNumberMatch: true
          }
        }
      });

      toast({
        title: "Transaction Complete",
        description: "Your transaction has been processed. Redirecting to transaction details."
      });
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "There was an error processing your transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    currentStep,
    isSubmitting,
    handleInitiateTransaction,
    handleConfirmTransaction
  };
};
