
import React from 'react';
import { DeliveryPointData } from './types/pipelineTypes';
import { Check, Info, Database, Clock } from 'lucide-react';

interface SelectedPointInfoProps {
  point: DeliveryPointData | null;
}

const SelectedPointInfo: React.FC<SelectedPointInfoProps> = ({ point }) => {
  if (!point) return null;
  
  return (
    <div className="space-y-3 text-sm">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{point.name}</h3>
        <p className="text-gray-600 text-xs">{point.county}, {point.state}</p>
        <p className="text-gray-700 mt-1 text-xs">{point.description}</p>
      </div>
      
      <div className="bg-green-50 p-2 rounded-md border border-green-100">
        <h4 className="text-green-800 font-medium text-xs">EAC Availability</h4>
        <div className="mt-1">
          <p className="text-base font-bold text-green-700">{point.availableEACs.toLocaleString()}</p>
          <p className="text-green-700 text-xs">Available EACs</p>
          <p className="mt-1 text-green-800 font-medium text-xs">{point.eacPrice}</p>
        </div>
      </div>
      
      {point.verified_sources && point.verified_sources.length > 0 && (
        <div className="px-2 py-2 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-start">
            <Info className="h-3 w-3 text-blue-600 mt-0.5 mr-1" />
            <div>
              <p className="text-xs text-blue-800 font-medium">Verified via:</p>
              <ul className="mt-1 text-xs text-blue-700">
                {point.verified_sources.map((source, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-3 w-3 text-blue-600 mr-1" /> 
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {point.connected_entities && point.connected_entities.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center">
            <Database className="h-3 w-3 mr-1 text-gray-600" />
            Connected Entities ({point.connected_entities.length})
          </h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {point.connected_entities.map((entity, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-md border border-gray-200">
                <p className="font-medium text-xs">{entity.name}</p>
                <div className="mt-1 text-xs text-gray-600 grid grid-cols-1 gap-x-1">
                  <span>Type: {entity.type}</span>
                  <span>ID: {entity.id}</span>
                  {entity.max_throughput && (
                    <span>Max: {entity.max_throughput}</span>
                  )}
                  {entity.ferc_docket && (
                    <span className="text-blue-600">FERC: {entity.ferc_docket}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedPointInfo;
