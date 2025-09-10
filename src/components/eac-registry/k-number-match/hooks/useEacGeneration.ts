
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateMatchedEACs } from '../utils/eacGenerator';
import { MatchedEAC } from '../types';
import { TransactionDetails } from '../schema';

// Calculate days between two dates (inclusive of start and end date)
const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Set both dates to midnight to avoid time zone issues
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Calculate difference in days (add 1 to include both start and end dates)
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return Math.max(1, diffDays); // Ensure at least 1 day
};

export const useEacGeneration = () => {
  const { toast } = useToast();
  const [matchedEACs, setMatchedEACs] = useState<MatchedEAC[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails>({
    quantity: "0",
    segment: ["production"],
    offtakePoint: "REX Main Line",
    transactionType: "spot",
    startDate: "",
    endDate: "",
    dailyVolume: ""
  });
  
  const generateEacs = (
    contractId: string, 
    pipeline: "REX" | "Ruby", 
    emissionPoints: string[], 
    orderType: string, 
    isCarbonNeutral: boolean, 
    startDate: Date, 
    endDate: Date, 
    receiptLocationId?: string, 
    counterparties?: any[]
  ): MatchedEAC[] => {
    console.log("useEacGeneration.generateEacs called with:", {
      contractId, pipeline, emissionPoints, orderType, isCarbonNeutral, 
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      receiptLocationId
    });
    
    // If no emission points are selected, use all available points
    const effectiveEmissionPoints = emissionPoints.length > 0 
      ? emissionPoints 
      : ['production', 'processing', 'transportation', 'gathering'];
    
    console.log("Using emission points:", effectiveEmissionPoints);
    
    // Generate EACs regardless of counterparty information
    try {
      const eacs = generateMatchedEACs(
        contractId,
        pipeline,
        effectiveEmissionPoints,
        orderType,
        isCarbonNeutral,
        startDate,
        endDate,
        receiptLocationId,
        counterparties,
        // Add QET compatibility flag - true when no specific points were selected
        emissionPoints.length === 0
      );
      
      console.log("Generated matchedEACs with", eacs.length, "EACs");
      setMatchedEACs(eacs);
      
      // Calculate days in period
      const daysInPeriod = calculateDaysBetween(startDate, endDate);
      
      // Calculate the daily volume (standardized at 2,000 MMBtu per day per segment)
      const standardDailyVolume = 2000 * effectiveEmissionPoints.length;
      
      // Calculate total volume for the entire period
      const totalVolume = standardDailyVolume * daysInPeriod;
      
      // Create a segments array that includes all emission points
      // and optionally adds carbonNeutral as a display-only segment
      const segments: string[] = [...effectiveEmissionPoints];
      if (isCarbonNeutral) {
        segments.push('carbonNeutral');
      }
      
      setTransactionDetails({
        ...transactionDetails,
        quantity: totalVolume.toString(),
        dailyVolume: standardDailyVolume.toString(),
        transactionType: orderType as "spot" | "forward",
        segment: segments,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      
      // Add receipt location to success message for REX pipeline
      let successMessage = `Found ${eacs.length} EACs for contract ${contractId}`;
      if (pipeline === 'REX' && receiptLocationId) {
        successMessage += ` at receipt location ${receiptLocationId}`;
      }
      
      toast({
        title: "EACs Successfully Matched",
        description: successMessage,
      });
      
      return eacs;
    } catch (error) {
      console.error("Error generating EACs:", error);
      toast({
        title: "Error",
        description: "Failed to generate EACs. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };
  
  return {
    matchedEACs,
    transactionDetails,
    generateEacs,
    setMatchedEACs
  };
};
