
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { PipelineSelection } from './types/pipelineTypes';

interface PipelineSelectorProps {
  pipelines: PipelineSelection[];
  onPipelineToggle: (id: string, checked: boolean) => void;
  showLabels: boolean;
  onToggleLabels: (show: boolean) => void;
}

const PipelineSelector: React.FC<PipelineSelectorProps> = ({
  pipelines,
  onPipelineToggle,
  showLabels,
  onToggleLabels
}) => {
  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-md bg-white shadow-sm">
      <h3 className="font-medium text-sm mb-1">Pipeline Selection</h3>
      <div className="space-y-2">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`pipeline-${pipeline.id}`}
              checked={pipeline.checked} 
              onCheckedChange={(checked) => onPipelineToggle(pipeline.id, checked === true)}
            />
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: pipeline.color }}
            />
            <label 
              htmlFor={`pipeline-${pipeline.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {pipeline.name}
            </label>
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t mt-2">
        <div className="flex items-center justify-between">
          <label htmlFor="show-labels" className="text-sm font-medium">
            Show Segment Labels
          </label>
          <Switch 
            id="show-labels" 
            checked={showLabels}
            onCheckedChange={onToggleLabels}
          />
        </div>
      </div>
    </div>
  );
};

export default PipelineSelector;
