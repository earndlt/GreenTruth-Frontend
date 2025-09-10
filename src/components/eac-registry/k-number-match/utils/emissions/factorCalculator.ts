
interface EmissionMetrics {
  volume: number;
  emissionFactor: string;
  pricePerMMBtu: number; // Added price per MMBtu
}

/**
 * Calculates emission metrics (volume, factor, and price) based on emission point type
 * 
 * @param point The emission point type
 * @returns Volume, emission factor, and price per MMBtu for the point type
 */
export const calculateEmissionMetrics = (point: string): EmissionMetrics => {
  // Set standard volume to ~2,000 MMBtu per day per segment for demonstration purposes
  const standardVolume = 2000;
  
  switch (point) {
    case 'production':
      return {
        volume: standardVolume,
        emissionFactor: '2.4 kg CO2e/MMBtu',
        pricePerMMBtu: 0.05
      };
    case 'processing':
      return {
        volume: standardVolume,
        emissionFactor: '1.8 kg CO2e/MMBtu',
        pricePerMMBtu: 0.05
      };
    case 'transportation':
      return {
        volume: standardVolume,
        emissionFactor: '0.9 kg CO2e/MMBtu',
        pricePerMMBtu: 0.05
      };
    case 'gathering_boosting':
      return {
        volume: standardVolume,
        emissionFactor: '1.2 kg CO2e/MMBtu',
        pricePerMMBtu: 0.05
      };
    default:
      return {
        volume: standardVolume,
        emissionFactor: '1.5 kg CO2e/MMBtu',
        pricePerMMBtu: 0.05
      };
  }
};

/**
 * Calculates the total price for multiple emission points
 * 
 * @param points Array of emission point types
 * @returns Total price per MMBtu for all emission points
 */
export const calculateTotalPriceForPoints = (points: string[]): number => {
  if (!points || points.length === 0) {
    // Default to all emission points if none selected
    return 0.20; // $0.05 x 4 standard emission points
  }
  
  return points.reduce((total, point) => {
    const metrics = calculateEmissionMetrics(point);
    return total + metrics.pricePerMMBtu;
  }, 0);
};
