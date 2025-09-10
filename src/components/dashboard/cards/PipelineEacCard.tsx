
import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PipelineData, DeliveryPointData } from '@/components/eac-registry/map/types/pipelineTypes';
import { rexPipelineData } from '@/data/rex-pipeline';
import { rubyPipelineData } from '@/data/rubyPipelineData';

const useDeliveryPoints = (pipelineData: PipelineData[]): DeliveryPointData[] => {
  const deliveryPoints: DeliveryPointData[] = [];
  
  pipelineData.forEach(pipeline => {
    pipeline.features.forEach(feature => {
      if (
        feature.geometry.type === 'Point' && 
        feature.properties && 
        (feature.properties.type === 'Delivery Point' || feature.properties.type === 'Offtake Point')
      ) {
        deliveryPoints.push({
          name: feature.properties.name || 'Unnamed Point',
          state: feature.properties.state || '',
          county: feature.properties.county || '',
          description: feature.properties.description || '',
          availableEACs: feature.properties.availableEACs || 0,
          eacPrice: feature.properties.eacPrice || '',
          verified_sources: feature.properties.verified_sources,
          connected_entities: feature.properties.connected_entities,
          // Add pipeline identifier to track which pipeline this point belongs to
          pipeline: pipeline === rexPipelineData ? 'rex' : 'ruby'
        });
      }
    });
  });
  
  return deliveryPoints.sort((a, b) => b.availableEACs - a.availableEACs);
};

const PipelineEacCard = () => {
  const navigate = useNavigate();
  const pipelineData = [rexPipelineData, rubyPipelineData];
  const deliveryPoints = useDeliveryPoints(pipelineData);
  const topPoints = deliveryPoints.slice(0, 5); // Show top 5 points
  
  const totalAvailableEACs = deliveryPoints.reduce(
    (total, point) => total + point.availableEACs, 
    0
  );
  
  const navigateToPipelineMap = () => {
    navigate('/eac-registry', { state: { activeTab: 'gas-trace' } });
  };
  
  const navigateToDeliveryPoint = (point: DeliveryPointData) => {
    // Redirect to gas trace since pipeline map is hidden for production
    navigate('/eac-registry', { 
      state: { 
        /* activeTab: 'pipeline-map',
        selectedDeliveryPoint: {
          ...point,
          pipeline: point.pipeline || (point.state.toLowerCase().includes('oregon') || 
                                    point.state.toLowerCase().includes('nevada') || 
                                    point.state.toLowerCase().includes('utah') || 
                                    point.state.toLowerCase().includes('wyoming') ||
                                    point.state.toLowerCase().includes('idaho') ||
                                    point.state.toLowerCase().includes('california') ? 'ruby' : 'rex')
        } */
        activeTab: 'gas-trace'
      }
    });
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-purple-500" />
          <h3 className="text-lg font-medium">Pipeline EACs</h3>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
          {deliveryPoints.length} Delivery Points
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">Total Available EACs</span>
          <span className="text-lg font-semibold text-green-600">{totalAvailableEACs.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full" 
            style={{ width: `${Math.min(100, (totalAvailableEACs / 15000) * 100)}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        <h4 className="text-sm font-medium text-gray-700 md:col-span-3 lg:col-span-5">Top Delivery Points</h4>
        
        {topPoints.map((point, index) => (
          <div 
            key={index} 
            className="p-2 bg-gray-50 rounded-md border border-gray-100 hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition-colors"
            onClick={() => navigateToDeliveryPoint(point)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{point.name}</p>
                <p className="text-xs text-gray-500">{point.state}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">{point.availableEACs.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{point.eacPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center text-purple-600 border-purple-200 hover:bg-purple-50"
          onClick={navigateToPipelineMap}
        >
          View Full EAC Map <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PipelineEacCard;
