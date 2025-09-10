import React from 'react';
import { DeliveryPointData, LngTerminalData } from './map/types/pipelineTypes';
import StandardEacsSection from './search-results/StandardEacsSection';
import FercEacsSection from './search-results/FercEacsSection';
import LngCargoSection from './lng-terminals/LngCargoSection';
import LngTerminalInfo from './lng-terminals/LngTerminalInfo';

interface EacSearchResultProps {
  deliveryPoint: DeliveryPointData;
}

const EacSearchResults: React.FC<EacSearchResultProps> = ({ deliveryPoint }) => {
  // Check if this is an LNG terminal
  const isLngTerminal = (deliveryPoint as any).terminal || 
                       (deliveryPoint as any).cargoFrequency ||
                       deliveryPoint.name.toLowerCase().includes('lng');
  
  if (isLngTerminal) {
    const lngTerminal = deliveryPoint as LngTerminalData;
    return (
      <>
        <LngTerminalInfo terminal={lngTerminal} />
        <LngCargoSection terminal={lngTerminal} />
      </>
    );
  }

  return (
    <>
      <FercEacsSection deliveryPoint={deliveryPoint} />
      <StandardEacsSection deliveryPoint={deliveryPoint} />
    </>
  );
};

export default EacSearchResults;