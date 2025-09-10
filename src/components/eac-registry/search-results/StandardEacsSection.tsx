
import React from 'react';
import { DeliveryPointData } from '../map/types/pipelineTypes';
import EacCard from './EacCard';
import { EacData } from '../purchase/types';

interface StandardEacsSectionProps {
  deliveryPoint: DeliveryPointData;
}

const StandardEacsSection: React.FC<StandardEacsSectionProps> = ({ deliveryPoint }) => {
  // Calculate price per EAC without the $/MMBtu part
  const priceValue = parseFloat(deliveryPoint.eacPrice.replace(/[^\d.]/g, ''));
  
  const generateMockEacs = (): EacData[] => {
    // Include a Methanol EAC for testing/demonstration
    return [1, 2, 3].map((index) => {
      // Slightly adjust price and amount for variety
      const adjustedPrice = (priceValue * (1 + (index * 0.05))).toFixed(2);
      const adjustedAmount = Math.floor(deliveryPoint.availableEACs / (index + 0.5));
      
      // For index 3, make it a Methanol EAC to demonstrate different unit handling
      const producer = ['Williams', 'Antero Resources', 'EQT Corporation'][index - 1];
      const certType = index === 3 ? 'Methanol' : ['RSG Certified', 'Carbon Neutral', 'Low Methane Intensity'][index - 1];
      
      return {
        id: `eac-${index}`,
        producer,
        certType,
        available: adjustedAmount,
        price: adjustedPrice,
        vintage: `2023-Q${index}`,
        status: 'available',
        availableFrom: `2023-Q${index}`,
        energySource: certType === 'Methanol' ? 'Methanol Production' : 'Renewable Natural Gas',
        description: `${certType} certificate from ${producer}`,
        deliveryPoint
      };
    });
  };

  const standardEacs = generateMockEacs();

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Available Environmental Attribute Certificates</h3>
      <p className="text-sm text-muted-foreground">
        Select from available EACs at {deliveryPoint.name} ({deliveryPoint.county}, {deliveryPoint.state})
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {standardEacs.map((eac, index) => (
          <EacCard 
            key={eac.id} 
            eac={eac} 
            index={index} 
            variant="standard" 
          />
        ))}
      </div>
    </div>
  );
};

export default StandardEacsSection;
