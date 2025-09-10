
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface EntityInformationSectionProps {
  from: string;
  to: string;
}

const EntityInformationSection = ({ from, to }: EntityInformationSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Entity Information</h3>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium">{from}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-medium">{to}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityInformationSection;
