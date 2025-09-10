
import { useNavigationControl } from './useNavigationControl';
import { useCompanySelection } from './useCompanySelection';
import { useTransactionSubmission } from './useTransactionSubmission';
import { FormValues } from '../types';

export const usePurchaseState = (onClose: () => void, navigate: any) => {
  const { 
    step, 
    navigateToPaymentSettings, 
    navigateToDashboard, 
    nextStep, 
    prevStep 
  } = useNavigationControl(onClose, navigate);
  
  const { 
    selectedCompany, 
    showPaymentMethodForm, 
    handleSelectCompany, 
    togglePaymentMethodForm 
  } = useCompanySelection();
  
  const { 
    isSubmitting, 
    transactionId, 
    onSubmitTransaction 
  } = useTransactionSubmission();
  
  return {
    // Navigation
    step,
    nextStep,
    prevStep,
    navigateToPaymentSettings,
    navigateToDashboard,
    
    // Company selection
    selectedCompany,
    showPaymentMethodForm,
    handleSelectCompany,
    togglePaymentMethodForm,
    
    // Transaction submission
    isSubmitting,
    transactionId,
    onSubmitTransaction
  };
};
