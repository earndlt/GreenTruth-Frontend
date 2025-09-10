
import React from 'react';
import PipelineSelector from '../map/PipelineSelector';
import LngTerminalSelector from './LngTerminalSelector';
import SelectedPointInfo from '../map/SelectedPointInfo';
import { DeliveryPointData, PipelineSelection } from '../map/types/pipelineTypes';
import { Info } from 'lucide-react';

interface SelectorPanelProps {
  pipelineSelections: PipelineSelection[];
  onPipelineToggle: (id: string, checked: boolean) => void;
  selectedDeliveryPoint: DeliveryPointData | null;
  showLabels: boolean;
  onToggleLabels: (show: boolean) => void;
}

const SelectorPanel: React.FC<SelectorPanelProps> = ({
  pipelineSelections,
  onPipelineToggle,
  selectedDeliveryPoint,
  showLabels,
  onToggleLabels
}) => {
  const activePipelines = pipelineSelections.filter(p => p.checked);
  const hasPipelineSelected = activePipelines.length > 0;

  // Separate pipelines and LNG terminals
  const pipelines = pipelineSelections.filter(p => !p.id.includes('plaquemines') && !p.id.includes('sabine'));
  const lngTerminals = pipelineSelections.filter(p => p.id.includes('plaquemines') || p.id.includes('sabine'));

  return (
    <div className="h-full p-4 flex flex-col">
      <PipelineSelector
        pipelines={pipelines}
        onPipelineToggle={onPipelineToggle}
        showLabels={showLabels}
        onToggleLabels={onToggleLabels}
      />

      <div className="mt-4 pt-4 border-t">
        <h3 className="font-medium text-sm mb-3">LNG Terminals</h3>
        <LngTerminalSelector
          terminals={lngTerminals}
          onTerminalToggle={onPipelineToggle}
        />
      </div>

      {hasPipelineSelected && !selectedDeliveryPoint && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p>Click on any delivery point or LNG terminal on the map to discover available EACs or cargo reservations.</p>
              <p className="mt-1 text-xs text-blue-600">Hover over points to see their names.</p>
            </div>
          </div>
        </div>
      )}

      {selectedDeliveryPoint && (
        <div className="mt-4 flex-grow overflow-auto">
          <h3 className="text-sm font-medium mb-2">Selected Point</h3>
          <SelectedPointInfo point={selectedDeliveryPoint} />
        </div>
      )}
    </div>
  );
};

export default SelectorPanel;
