
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Award, BarChart4, Info, User2, CheckCircle, MapPin } from 'lucide-react';
import { DiscoveredVendor } from '../VendorDiscovery';

interface VendorCardProps {
  vendor: DiscoveredVendor;
  selected: boolean;
  onSelect: (vendorId: string) => void;
  onViewDetails: (vendor: DiscoveredVendor) => void;
  companyName?: string;
}

const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  selected,
  onSelect,
  onViewDetails,
  companyName
}) => {
  return (
    <Card className={`border-2 ${selected ? 'border-primary' : 'border-border'}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">{vendor.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {vendor.location}
            </div>
          </div>
          <Badge 
            className={
              vendor.matchScore >= 90 ? 'bg-green-500' :
              vendor.matchScore >= 80 ? 'bg-green-600' :
              vendor.matchScore >= 70 ? 'bg-amber-500' :
              'bg-amber-600'
            }
          >
            {vendor.matchScore}% Match {companyName ? `with ${companyName}` : ''}
          </Badge>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{vendor.category}</span>
          </div>
          
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Sustainability Score: {vendor.sustainability.score}%</span>
          </div>
          
          <div className="flex items-center">
            <BarChart4 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              Policy Match: ENV {vendor.policyMatch.environmental}% | 
              PROC {vendor.policyMatch.procurement}% | 
              ESG {vendor.policyMatch.esg}%
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {vendor.products.map((product, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50">
              {product}
            </Badge>
          ))}
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(vendor)}
          >
            <Info className="h-4 w-4 mr-2" />
            Details
          </Button>
          
          <Button
            variant={selected ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onSelect(vendor.id)}
          >
            {selected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Selected
              </>
            ) : (
              <>
                <User2 className="h-4 w-4 mr-2" />
                Select
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
