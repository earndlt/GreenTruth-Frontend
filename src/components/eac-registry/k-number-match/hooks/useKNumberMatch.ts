
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useContractValidation } from './useContractValidation';
import { useEacGeneration } from './useEacGeneration';
import { useCompanySelection } from './useCompanySelection';
import { useTransactionFlow } from './useTransactionFlow';
import { KNumberMatchFormValues } from '../schema';
import { corporateWallets } from '@/data/corporateWallets';
import { useEac } from '@/context/EacContext';

export const useKNumberMatch = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Use EAC context to get real EAC data
  const { eacOrganizations } = useEac();
  
  const {
    isLoading,
    setIsLoading,
    contractValidated,
    validationMessage,
    validateContract
  } = useContractValidation();
  
  const {
    matchedEACs,
    transactionDetails,
    generateEacs,
    setMatchedEACs
  } = useEacGeneration();
  
  const {
    selectedCompany,
    handleSelectCompany
  } = useCompanySelection();
  
  const {
    currentStep,
    isSubmitting,
    handleInitiateTransaction,
    handleConfirmTransaction
  } = useTransactionFlow();
  
  // Initialize with default company
  useEffect(() => {
    if (corporateWallets.length > 0 && !selectedCompany) {
      handleSelectCompany(corporateWallets[0].id);
    }
  }, [selectedCompany, handleSelectCompany]);
  
  // Function to filter real EACs based on search parameters
  const filterRealEACs = (data: KNumberMatchFormValues) => {
    if (!eacOrganizations || eacOrganizations.length === 0) {
      return [];
    }

    // Transform and filter EAC data based on search criteria
    const filteredEACs = eacOrganizations
      .filter(org => {
        const { organization, profile, assets } = org;
        
        // Check if organization has assets
        const hasAssets = assets && assets.summary && Object.keys(assets.summary).length > 0;
        if (!hasAssets) return false;
        
        const summary = assets.summary!;
        
        // Filter by pipeline if specified
        if (data.pipeline) {
          // This is a simplified filter - in a real implementation, you'd have more sophisticated logic
          // For now, we'll show EACs that could potentially match the pipeline
          const deliveryState = profile?.address?.state;
          if (data.pipeline === "REX" && deliveryState) {
            // REX pipeline typically serves certain states
            const rexStates = ['Colorado', 'Kansas', 'Missouri', 'Illinois', 'Indiana', 'Ohio'];
            if (!rexStates.includes(deliveryState)) return false;
          } else if (data.pipeline === "Ruby" && deliveryState) {
            // Ruby pipeline typically serves certain states
            const rubyStates = ['Oregon', 'Nevada', 'Utah', 'Wyoming', 'Idaho', 'California'];
            if (!rubyStates.includes(deliveryState)) return false;
          }
        }
        
        // Filter by receipt location if specified
        if (data.receiptLocationId && data.receiptLocationId.trim()) {
          // This would need more sophisticated logic based on actual receipt location data
          // For now, we'll show EACs that could potentially match
        }
        
        return true;
      })
      .map(org => {
        const { organization, profile, assets } = org;
        const summary = assets.summary!;
        
        // Transform to match the expected MatchedEAC format
        return {
          id: `ORG-${organization.id.slice(0, 8).toUpperCase()}`,
          contractId: data.contractId,
          pipeline: data.pipeline,
          emissionPoint: summary?.token_type?.[0] || "QET",
          quantity: summary?.total_balance_available || 0,
          price: summary?.standards_default_avg_carbon_intensity || 0,
          producer: organization.name,
          deliveryPoint: `${profile?.address?.city || "Unknown"}, ${profile?.address?.state || "Unknown"}`,
          vintage: summary?.formatted_vintage?.[0] || summary?.vintage_year?.[0] || "2025",
          standard: summary?.standards?.[0] || "RED_II",
          verifier: summary?.verifiers?.[0] || "N/A",
          measurer: summary?.measurers?.[0] || "N/A",
          organizationId: organization.id,
          profileId: profile?.id || "",
          profileWalletId: profile?.wallet?.id || "",
          ein: organization.ein,
          isIssuer: organization.isIssuer,
          isMeasurer: organization.isMeasurer,
          isVerifier: organization.isVerifier,
          totalBalance: summary?.total_balance_total || 0,
          lockedBalance: summary?.total_balance_locked || 0,
          retiredBalance: summary?.total_balance_retired || 0,
          co2eTotal: summary?.CO2E_TOTAL || 0,
          hasAssets: true,
        };
      });

    return filteredEACs;
  };
  
  const handleSubmit = async (data: KNumberMatchFormValues) => {
    console.log("useKNumberMatch - handleSubmit called with data:", data);
    setIsLoading(true);
    // Reset the matched EACs before fetching new ones
    setMatchedEACs([]);
    setFormSubmitted(true);
    
    // If dates are not set, generate defaults for today (for spot) or future (for forward)
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 1);
    
    // Use simple date parsing approach
    let startDate = today;
    let endDate = data.orderType === "spot" ? today : futureDate;
    
    // Try to parse startDate if provided
    if (data.startDate) {
      if (data.startDate instanceof Date) {
        startDate = data.startDate;
      } else if (typeof data.startDate === 'string') {
        try {
          startDate = new Date(data.startDate);
        } catch (e) {
          console.warn("Error parsing start date, using default:", e);
        }
      }
    }
    
    // Try to parse endDate if provided
    if (data.endDate) {
      if (data.endDate instanceof Date) {
        endDate = data.endDate;
      } else if (typeof data.endDate === 'string') {
        try {
          endDate = new Date(data.endDate);
        } catch (e) {
          console.warn("Error parsing end date, using default:", e);
        }
      }
    }
    
    try {
      // Validate the contract with the given parameters
      console.log("Validating contract:", data.contractId, data.pipeline, data.receiptLocationId);
      const isValid = validateContract(data.contractId, data.pipeline, data.receiptLocationId);
      
      if (isValid) {
        console.log("Contract is valid, searching for matching EACs...");
        toast({
          title: "Searching for EACs",
          description: "Finding matching EACs for your gas trace parameters...",
        });
        
        // Add a slight delay to simulate API call
        setTimeout(() => {
          try {
            // Filter real EACs based on search parameters
            const filteredEACs = filterRealEACs(data);
            
            console.log("Found matching EACs:", filteredEACs.length);
            
            // Set the matched EACs
            setMatchedEACs(filteredEACs);
            
            if (filteredEACs.length > 0) {
              toast({
                title: "Search Complete",
                description: `Found ${filteredEACs.length} matching EACs for your gas trace parameters.`,
              });
            } else {
              toast({
                title: "No Matches Found",
                description: "No EACs match your current search criteria. Try adjusting your parameters.",
                variant: "destructive",
              });
            }
            
            setIsLoading(false);
          } catch (error) {
            console.error("Error filtering EACs:", error);
            toast({
              title: "Error",
              description: "There was an error searching for EACs. Please try again.",
              variant: "destructive",
            });
            setIsLoading(false);
          }
        }, 1500);
      } else {
        console.log("Contract validation failed");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const confirmTransaction = () => {
    handleConfirmTransaction(
      selectedCompany,
      matchedEACs,
      transactionDetails.transactionType
    );
  };

  return {
    isLoading,
    contractValidated,
    matchedEACs,
    validationMessage,
    selectedCompany,
    currentStep,
    isSubmitting,
    formSubmitted,
    transactionDetails,
    handleSubmit,
    handleSelectCompany,
    handleInitiateTransaction,
    handleConfirmTransaction: confirmTransaction
  };
};
