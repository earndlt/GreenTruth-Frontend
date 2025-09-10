
import React from 'react';
import { Building, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VendorHeaderProps {
  name: string;
  location: string;
  matchScore: number;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({ name, location, matchScore }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Building className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-bold">{name}</h2>
        </div>
        <Badge 
          className={`text-lg py-1 px-3 ${
            matchScore >= 90 ? 'bg-green-500' :
            matchScore >= 80 ? 'bg-green-600' :
            matchScore >= 70 ? 'bg-amber-500' :
            'bg-amber-600'
          }`}
        >
          {matchScore}% Match
        </Badge>
      </div>
      <div className="flex items-center text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1" />
        {location}
      </div>
    </div>
  );
};

export default VendorHeader;
