
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateContractId } from '../utils/validation/contractValidator';
import { getReceiptLocationNameById } from '../utils/receiptLocations';

export const useContractValidation = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [contractValidated, setContractValidated] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState("");
  
  const validateContract = (contractId: string, pipeline: "REX" | "Ruby", receiptLocationId?: string) => {
    console.log("validateContract called with:", { contractId, pipeline, receiptLocationId });
    
    try {
      // Additional validation for REX pipeline requiring receipt location ID
      if (pipeline === 'REX' && !receiptLocationId) {
        console.log("Receipt Location ID is required for REX pipeline");
        setContractValidated(false);
        setValidationMessage("Receipt Location ID is required for REX pipeline contracts");
        
        toast({
          title: "Validation Failed",
          description: "Receipt Location ID is required for REX pipeline",
          variant: "destructive",
        });
        
        return false;
      }
      
      // Basic contract ID validation
      const validation = validateContractId(contractId, pipeline);
      console.log("Contract validation result:", validation);
      setContractValidated(validation.isValid);
      
      // For REX pipeline, add receipt location info to validation message if valid
      if (pipeline === 'REX' && validation.isValid && receiptLocationId) {
        const locationName = getReceiptLocationNameById(receiptLocationId);
        setValidationMessage(
          `${validation.message}. Receipt Location: ${receiptLocationId} - ${locationName || 'Unknown'}`
        );
      } else {
        setValidationMessage(validation.message);
      }
      
      if (!validation.isValid) {
        toast({
          title: "Contract Validation Failed",
          description: validation.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Contract Validated",
          description: validation.message,
        });
      }
      
      return validation.isValid;
    } catch (error) {
      console.error("Error in validateContract:", error);
      setContractValidated(false);
      setValidationMessage("An error occurred during validation");
      
      toast({
        title: "Validation Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  return {
    isLoading,
    setIsLoading,
    contractValidated,
    validationMessage,
    validateContract
  };
};
