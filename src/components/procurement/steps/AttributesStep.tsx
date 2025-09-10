
import React from 'react';
import { cn } from '@/lib/utils';
import { EnvironmentalAttribute } from '../types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AttributesStepProps {
  environmentalAttributes: EnvironmentalAttribute[];
  toggleAttribute: (id: string) => void;
  customAttributes: string;
  setCustomAttributes: (text: string) => void;
}

const AttributesStep: React.FC<AttributesStepProps> = ({ 
  environmentalAttributes, 
  toggleAttribute,
  customAttributes,
  setCustomAttributes
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium mb-3">Select Environmental Attributes</h3>
      <div className="space-y-3">
        {environmentalAttributes.map(attr => (
          <div
            key={attr.id}
            className={cn(
              "p-3 border rounded-md cursor-pointer hover:border-primary transition-colors",
              attr.selected ? "border-primary bg-primary/5" : ""
            )}
            onClick={() => toggleAttribute(attr.id)}
          >
            <div className="font-medium">{attr.name}</div>
            <div className="text-sm text-muted-foreground">{attr.description}</div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 space-y-2">
        <Label htmlFor="custom-attributes" className="text-sm font-medium">
          Additional Requirements
        </Label>
        <Textarea 
          id="custom-attributes"
          placeholder="Describe any additional attributes or requirements (e.g., measurement and verification standards and practices)"
          className="min-h-[120px]"
          value={customAttributes}
          onChange={(e) => setCustomAttributes(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AttributesStep;
