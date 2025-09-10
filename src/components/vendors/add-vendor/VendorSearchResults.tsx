
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

interface VendorSearchResultProps {
  vendors: any[];
  onSelectVendor: (vendor: any) => void;
}

const VendorSearchResults: React.FC<VendorSearchResultProps> = ({
  vendors,
  onSelectVendor,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Found {vendors.length} matching vendors. Please select one to connect with:
      </p>
      
      <div className="space-y-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="border hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground">{vendor.location}</p>
                  <p className="text-sm text-muted-foreground">{vendor.category}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => onSelectVendor(vendor)}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorSearchResults;
