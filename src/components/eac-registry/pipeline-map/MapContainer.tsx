
import React from 'react';
import GoogleMap from '../GoogleMap';
import { DeliveryPointData, PipelineData, PipelineSelection } from '../map/types/pipelineTypes';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDnWie5MbcyPyVEiAvBSYNyP6YyRPhDav0';

interface MapContainerProps {
  mapVisible: boolean;
  toggleMap: () => void;
  mapKey: number;
  activePipelines: PipelineData[];
  activePipelineSelections: PipelineSelection[];
  selectedDeliveryPoint: DeliveryPointData | null;
  onSelectDeliveryPoint: (point: DeliveryPointData) => void;
  showLabels: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({
  mapVisible,
  toggleMap,
  mapKey,
  activePipelines,
  activePipelineSelections,
  selectedDeliveryPoint,
  onSelectDeliveryPoint,
  showLabels
}) => {
  if (!mapVisible) {
    return (
      <div className="bg-gray-100 rounded-md p-8 text-center h-full flex items-center justify-center">
        <div>
          <p className="mb-4">Map is currently hidden</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={toggleMap}
          >
            Show Map
          </button>
        </div>
      </div>
    );
  }

  const noPipelinesSelected = activePipelineSelections.length === 0;

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button 
          className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          onClick={toggleMap}
        >
          Toggle Map Visibility
        </button>
      </div>
      
      {noPipelinesSelected ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center h-[600px] flex items-center justify-center">
          <div className="max-w-md">
            <h3 className="text-lg font-medium mb-2">No Pipelines Selected</h3>
            <p className="text-gray-600 mb-4">
              Please select at least one pipeline from the sidebar to view the map data.
            </p>
          </div>
        </div>
      ) : (
        <GoogleMap 
          key={mapKey}
          apiKey={GOOGLE_MAPS_API_KEY}
          onSelectDeliveryPoint={onSelectDeliveryPoint} 
          pipelineData={activePipelines}
          activePipelines={activePipelineSelections}
          selectedDeliveryPoint={selectedDeliveryPoint}
          showLabels={showLabels}
        />
      )}
    </div>
  );
};

export default MapContainer;
