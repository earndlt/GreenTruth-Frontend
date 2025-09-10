
import React from 'react';
import { PipelineSelection } from './types/pipelineTypes';

interface PipelineInfoHeaderProps {
  activePipelines: PipelineSelection[];
}

const PipelineInfoHeader: React.FC<PipelineInfoHeaderProps> = ({ 
  activePipelines
}) => {
  // Get the first active pipeline for display
  const primaryPipeline = activePipelines.length > 0 ? activePipelines[0] : null;

  // Display pipeline-specific details based on which pipeline is active
  const renderPipelineDetails = () => {
    if (activePipelines.length === 0) {
      return (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <h3 className="text-gray-800 font-medium mb-1">No pipeline selected</h3>
          <p className="text-sm text-gray-700">
            Please select a pipeline from the selection panel
          </p>
        </div>
      );
    }
    
    if (activePipelines.length > 1) {
      return (
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <h3 className="text-blue-800 font-medium mb-1">Multiple Pipelines Selected</h3>
          <p className="text-sm text-blue-700">
            {activePipelines.map(p => p.name).join(', ')}
          </p>
        </div>
      );
    }
    
    if (primaryPipeline?.id === 'rex') {
      return (
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <h3 className="text-blue-800 font-medium mb-1">Rockies Express Pipeline</h3>
          <p className="text-sm text-blue-700">
            1,700 miles from Colorado to Ohio | Capacity: Up to 1,800 MMcf/d | Operated by Tallgrass Energy
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Three zones: Entrega (Zone 1), West (Zone 2), East (Zone 3)
          </p>
        </div>
      );
    }
    
    if (primaryPipeline?.id === 'ruby') {
      return (
        <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
          <h3 className="text-purple-800 font-medium mb-1">Ruby Pipeline</h3>
          <p className="text-sm text-purple-700">
            675 miles from Wyoming to Oregon | Capacity: 1.5 Bcf/d | Operated by Tallgrass Energy
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      {renderPipelineDetails()}
    </div>
  );
};

export default PipelineInfoHeader;
