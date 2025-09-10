
import React from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import MapLoadingIndicator from './map/MapLoadingIndicator';
import PipelineInfoHeader from './map/PipelineInfoHeader';
import PipelineRenderer from './map/PipelineRenderer';
import { DeliveryPointData, PipelineData, PipelineSelection } from './map/types/pipelineTypes';
import { useGoogleMaps } from '@/hooks/use-google-maps';

interface GoogleMapProps {
  apiKey: string;
  onSelectDeliveryPoint?: (point: DeliveryPointData) => void;
  pipelineData: PipelineData[];
  activePipelines: PipelineSelection[];
  selectedDeliveryPoint?: DeliveryPointData | null;
  showLabels: boolean;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  apiKey, 
  onSelectDeliveryPoint,
  pipelineData,
  activePipelines,
  selectedDeliveryPoint,
  showLabels
}) => {
  const { toast } = useToast();
  const {
    mapRef,
    googleMapRef,
    markersRef,
    mapError,
    mapLoaded,
    selectedPoint,
    setSelectedPoint,
  } = useGoogleMaps({ apiKey, initialSelectedPoint: selectedDeliveryPoint });

  return (
    <div className="space-y-4">
      <PipelineInfoHeader 
        activePipelines={activePipelines}
      />
      
      <Card className="p-0 overflow-hidden rounded-md h-[600px] relative">
        <div ref={mapRef} className="absolute inset-0" />
        {mapLoaded && googleMapRef.current && (
          <PipelineRenderer 
            map={googleMapRef.current}
            pipelineData={pipelineData}
            onSelectDeliveryPoint={onSelectDeliveryPoint}
            markersRef={markersRef}
            setSelectedPoint={setSelectedPoint}
            selectedPoint={selectedPoint}
            showLabels={showLabels}
          />
        )}
        <MapLoadingIndicator 
          isLoading={!mapLoaded} 
          error={mapError} 
        />
      </Card>
    </div>
  );
};

export default GoogleMap;
