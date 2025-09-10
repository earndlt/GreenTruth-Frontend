
import { CounterpartyInfo } from "../schema";
import { validateContractId } from "./validation/contractValidator";
import { normalizeContractId, cleanContractId } from "./formatting/contractFormatter";
import { calculateEmissionMetrics, calculateTotalPriceForPoints } from "./emissions/factorCalculator";
import { getPipelineCounterparty, formatCounterparty } from "./counterparty/counterpartyUtils";
import { 
  formatDateRange, 
  generateEacId, 
  formatEmissionPointName, 
} from "./eac/eacFormatter";

export { validateContractId } from "./validation/contractValidator";
export type { ValidationResult } from "./validation/contractValidator";

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

// Generate mock EACs based on input criteria - one per emission point plus thermal if carbon neutral
export const generateMatchedEACs = (
  contractId: string,
  pipeline: "REX" | "Ruby",
  emissionPoints: string[],
  orderType: string,
  isCarbonNeutral: boolean = false,
  startDate: Date,
  endDate: Date,
  receiptLocationId?: string,
  counterparties?: CounterpartyInfo[],
  qetCompatible: boolean = false
) => {
  console.log("generateMatchedEACs called with:", {
    contractId,
    pipeline, 
    emissionPoints, 
    isCarbonNeutral,
    receiptLocationId,
    counterparties: counterparties?.length
  });
  
  // If emission points array is empty, provide defaults
  const effectiveEmissionPoints = emissionPoints.length > 0 
    ? emissionPoints 
    : ['production', 'processing', 'transportation', 'gathering'];
    
  console.log("Effective emission points:", effectiveEmissionPoints);

  // Normalize contract ID format
  const normalizedContractId = normalizeContractId(contractId);
  const cleanedContractId = cleanContractId(normalizedContractId);
  
  // Format dates for display
  const timeRange = formatDateRange(startDate, endDate);
  
  // Calculate days in the transaction period
  const daysInPeriod = calculateDaysBetween(startDate, endDate);
  console.log("Days in period:", daysInPeriod);
  
  // Generate common contract details
  const upstreamContractId = "960393"; // Reference contract
  const downstreamContractId = "962777"; // Reference contract
  
  // Base source facility name
  const baseFacility = `Mieco, Inc.`;
  
  // Calculate the total price for all emission points (approximately $0.05 per point)
  const totalPricePerMMBtu = calculateTotalPriceForPoints(effectiveEmissionPoints);
  
  // Make sure receipt location ID is a simple string if provided
  const cleanReceiptLocationId = typeof receiptLocationId === 'string' ? receiptLocationId : undefined;
  
  console.log("Creating EACs for points:", effectiveEmissionPoints);
  console.log("With counterparties:", counterparties?.map(c => ({ point: c.emissionPoint, name: c.counterpartyName })));
  
  // Create one EAC for each emission point
  const pointEACs = effectiveEmissionPoints.map((point, index) => {
    // Get emission metrics for this point
    const { volume: dailyVolume, emissionFactor, pricePerMMBtu } = calculateEmissionMetrics(point);
    
    // Calculate total volume based on daily volume and days in period
    const totalVolume = dailyVolume * daysInPeriod;
    
    // Create human-readable emission point name for display
    const pointName = formatEmissionPointName(point);
    
    // Format emission factor based on the point
    let formattedEmissionFactor = '';
    switch(point) {
      case 'production': formattedEmissionFactor = '2.4 kg CO2e/MMBtu'; break;
      case 'processing': formattedEmissionFactor = '1.8 kg CO2e/MMBtu'; break;
      case 'transportation': formattedEmissionFactor = '0.9 kg CO2e/MMBtu'; break;
      case 'gathering': formattedEmissionFactor = '1.2 kg CO2e/MMBtu'; break;
      default: formattedEmissionFactor = '1.5 kg CO2e/MMBtu';
    }
    
    // For transportation, always set counterparty to the pipeline
    if (point === 'transportation') {
      const pipelineCounterparty = getPipelineCounterparty(pipeline);
      
      return {
        id: generateEacId(pipeline, cleanedContractId, index + 1),
        contractId: normalizedContractId,
        upstreamContractId,
        downstreamContractId,
        volume: totalVolume,
        dailyVolume,
        daysInPeriod,
        sourceFacility: `${baseFacility} - ${pointName}`,
        emissionFactor: formattedEmissionFactor,
        emissionPoint: point,
        timeRange,
        receiptLocationId: cleanReceiptLocationId,
        counterparty: pipelineCounterparty,
        qetCompatible: qetCompatible,
        pricePerMMBtu: pricePerMMBtu.toFixed(2) // Price per MMBtu for this point
      };
    }
    
    // For non-transportation segments, handle counterparty
    const counterpartyInfo = counterparties?.find(c => c.emissionPoint === point);
    console.log(`Counterparty for ${point}:`, counterpartyInfo);
    
    // Format counterparty if it exists and user knows the counterparty
    let counterpartyData;
    if (counterpartyInfo && counterpartyInfo.knowsCounterparty) {
      counterpartyData = formatCounterparty(counterpartyInfo);
      console.log(`Formatted counterparty for ${point}:`, counterpartyData);
    }
    
    return {
      id: generateEacId(pipeline, cleanedContractId, index + 1),
      contractId: normalizedContractId,
      upstreamContractId,
      downstreamContractId,
      volume: totalVolume,
      dailyVolume,
      daysInPeriod,
      sourceFacility: `${baseFacility} - ${pointName}`,
      emissionFactor: formattedEmissionFactor,
      emissionPoint: point,
      timeRange,
      receiptLocationId: undefined, // Non-transportation points don't have receipt locations
      counterparty: counterpartyData,
      qetCompatible: qetCompatible,
      pricePerMMBtu: pricePerMMBtu.toFixed(2) // Price per MMBtu for this point
    };
  });
  
  // Add thermal offset EAC if carbon neutral is selected
  const eacs = [...pointEACs];
  
  if (isCarbonNeutral) {
    console.log("Adding carbon neutral thermal offset EAC");
    // Create a thermal offset EAC with a default counterparty
    const dailyVolume = 2000;
    const totalVolume = dailyVolume * daysInPeriod;
    
    eacs.push({
      id: generateEacId(pipeline, cleanedContractId, 'THERMAL'),
      contractId: normalizedContractId,
      upstreamContractId,
      downstreamContractId,
      volume: totalVolume,
      dailyVolume,
      daysInPeriod,
      sourceFacility: `${baseFacility} - Thermal Offset`,
      emissionFactor: '-1.6 kg CO2e/MMBtu', // Negative emission factor for carbon offsets
      emissionPoint: 'thermal',
      timeRange,
      receiptLocationId: undefined,
      counterparty: {
        name: "GreenOffset Partners Ltd.",
        contactName: "Carbon Offset Division",
        email: "offsets@greenpartners.example.com",
        phone: "555-987-6543",
        isApproved: true
      },
      qetCompatible: qetCompatible,
      pricePerMMBtu: '0.10' // Carbon offsets are typically more expensive
    });
  }
  
  console.log("Generated EACs:", eacs.length);
  console.log("First EAC sample:", eacs[0]);
  return eacs;
};
