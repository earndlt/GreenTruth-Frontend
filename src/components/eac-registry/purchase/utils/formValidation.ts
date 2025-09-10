import { useToast } from '@/hooks/use-toast';
import { FormValues } from '../types';

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateTransactionDetailsStep = (values: FormValues): boolean => {
    // Validate transaction details
    try {
      // Basic validations: these fields must always be filled
      if (!values.transactionType) {
        toast({
          title: "Transaction Type Required",
          description: "Please select a transaction type",
          variant: "destructive",
        });
        return false;
      }

      if (!values.quantity || isNaN(parseFloat(values.quantity)) || parseFloat(values.quantity) <= 0) {
        toast({
          title: "Valid Quantity Required",
          description: "Please enter a valid quantity greater than zero",
          variant: "destructive",
        });
        return false;
      }

      if (!values.segment) {
        toast({
          title: "Segment Required",
          description: "Please select a segment",
          variant: "destructive",
        });
        return false;
      }

      if (!values.offtakePoint) {
        toast({
          title: "Offtake Point Required",
          description: "Please select an offtake point",
          variant: "destructive",
        });
        return false;
      }

      // Forward transaction specific validations
      if (values.transactionType === 'forward') {
        // Validate date range
        if (!values.startDate || !values.endDate) {
          toast({
            title: "Date Range Required",
            description: "Please select both start and end dates for your forward purchase",
            variant: "destructive",
          });
          return false;
        }

        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);
        
        if (startDate >= endDate) {
          toast({
            title: "Invalid Date Range",
            description: "End date must be after start date",
            variant: "destructive",
          });
          return false;
        }

        // For forward transactions, we don't validate against available quantity
        // as these will be minted in the future
        
        // Validate daily volume for forward purchases
        if (!values.dailyVolume || isNaN(parseFloat(values.dailyVolume)) || parseFloat(values.dailyVolume) <= 0) {
          toast({
            title: "Daily Volume Required",
            description: "Please enter a valid daily volume greater than zero",
            variant: "destructive",
          });
          return false;
        }
      }

      // Validate company selection
      if (!values.companyId) {
        toast({
          title: "Company Required",
          description: "Please select a company for this transaction",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Validation error:", error);
      toast({
        title: "Validation Error",
        description: "Please check your inputs and try again",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    validateTransactionDetailsStep,
  };
};
