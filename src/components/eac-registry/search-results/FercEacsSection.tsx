
import React from 'react';
import { DeliveryPointData } from '../map/types/pipelineTypes';
import EacCard from './EacCard';
import { EacData } from '../purchase/types';

interface FercEacsSectionProps {
  deliveryPoint: DeliveryPointData;
}

const FercEacsSection: React.FC<FercEacsSectionProps> = ({ deliveryPoint }) => {
  const hasAuthorizedProducers = 
    deliveryPoint.authorized_producers && 
    deliveryPoint.authorized_producers.length > 0;
  
  if (!hasAuthorizedProducers) {
    return null;
  }

  const fercEacs: EacData[] = deliveryPoint.authorized_producers.map((producer, index) => {
    // Determine if this is a methanol producer (for demonstration/testing)
    const isMethanol = producer.name.toLowerCase().includes('methanol') || index === 0;
    
    return {
      id: `producer-${index}`,
      producer: producer.name,
      certType: isMethanol ? 'Methanol' : 'FERC Authorized',
      available: producer.available_eacs || 0,
      price: producer.eac_price?.replace(/[^\d.]/g, '') || "0.00",
      vintage: `2024`,
      status: 'available',
      availableFrom: 'Immediate',
      energySource: isMethanol ? 'Methanol' : 'Natural Gas',
      ferc_details: {
        contract: producer.contract_number,
        effective: producer.effective_date,
        details: producer.details
      },
      deliveryPoint
    };
  });

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Authorized Producer EACs</h3>
        <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-md text-xs font-medium">
          FERC Authorized
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        EACs from FERC-authorized producers at {deliveryPoint.name} ({deliveryPoint.county}, {deliveryPoint.state})
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fercEacs.map((eac, index) => (
          <EacCard 
            key={eac.id} 
            eac={eac} 
            index={index} 
            variant="ferc" 
          />
        ))}
      </div>
    </div>
  );
};

export default FercEacsSection;
