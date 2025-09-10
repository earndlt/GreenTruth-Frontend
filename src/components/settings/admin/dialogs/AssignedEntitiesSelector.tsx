
import React from 'react';
import { Label } from '@/components/ui/label';
import { Company } from '@/components/eac-registry/CompanySelector';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssignedEntitiesSelectorProps {
  companies: Company[];
  assignedEntities: string[];
  handleEntityChange: (entityId: string) => void;
}

const AssignedEntitiesSelector: React.FC<AssignedEntitiesSelectorProps> = ({
  companies,
  assignedEntities,
  handleEntityChange,
}) => (
  <div className="space-y-2">
    <Label>Assigned Corporate Entities</Label>
    <div className="border rounded-md p-2">
      <ScrollArea className="h-[130px]">
        <div className="space-y-2 pr-2">
          {companies.map(entity => (
            <label key={entity.id} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={assignedEntities.includes(entity.id)}
                onChange={() => handleEntityChange(entity.id)}
                className="rounded border-input"
              />
              <span className="text-sm">{entity.name}</span>
            </label>
          ))}
        </div>
      </ScrollArea>
    </div>
  </div>
);

export default AssignedEntitiesSelector;
