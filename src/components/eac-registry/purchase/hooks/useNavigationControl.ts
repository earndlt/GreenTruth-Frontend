
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useNavigationControl = (onClose: () => void, navigate: any) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const navigateToPaymentSettings = () => {
    navigate('/settings?tab=admin');
    toast({
      title: "Redirecting to Payment Settings",
      description: "You'll be redirected to the Transaction Payments section to manage your payment methods."
    });
  };
  
  const navigateToDashboard = () => {
    // First close the dialog to avoid any UI conflicts
    onClose();
    
    // Generate a unique ID for this transaction navigation to ensure state changes are detected
    const navigationId = `nav-${Date.now()}`;
    
    // Explicitly navigate to the EAC Registry page with the transactions tab active
    setTimeout(() => {
      navigate('/eac-registry', { 
        state: { 
          activeTab: 'transactions',
          highlightTransaction: true,
          navigationId: navigationId
        },
        replace: true
      });
      
      toast({
        title: "Transaction Complete",
        description: "Your transaction has been processed. Redirecting to transaction details."
      });
    }, 300); // Small delay to ensure dialog closes properly before navigation
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  return {
    step,
    navigateToPaymentSettings,
    navigateToDashboard,
    nextStep,
    prevStep
  };
};
