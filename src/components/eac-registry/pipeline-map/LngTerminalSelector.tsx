import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { PipelineSelection } from '../map/types/pipelineTypes';

interface LngTerminalSelectorProps {
  terminals: PipelineSelection[];
  onTerminalToggle: (id: string, checked: boolean) => void;
}

const LngTerminalSelector: React.FC<LngTerminalSelectorProps> = ({
  terminals,
  onTerminalToggle
}) => {
  return (
    <div className="space-y-3">
      {terminals.map((terminal) => (
        <div key={terminal.id} className="flex items-center space-x-3">
          <Checkbox 
            id={`terminal-${terminal.id}`}
            checked={terminal.checked} 
            onCheckedChange={(checked) => onTerminalToggle(terminal.id, checked === true)}
          />
          <div 
            className="w-3 h-3 rounded-full border" 
            style={{ backgroundColor: terminal.color }}
          />
          <label 
            htmlFor={`terminal-${terminal.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {terminal.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default LngTerminalSelector;