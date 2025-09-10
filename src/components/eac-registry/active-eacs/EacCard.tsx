import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';
import { EacData } from '../purchase/types';
import { getCommodityUnit, formatPriceWithUnit, formatQuantityWithUnit } from '@/utils/analytics';

interface EacCardProps {
  eac: {
    id: string;
    type: string;
    vendor: string;
    quantity: string;
    attributes: string[];
    date: string;
    price: string;
    producer: string;
    deliveryPoint: {
      name: string;
      state: string;
    };
    availableVolume: number;
    status: string;
    energySource: string;
    hasAssets?: boolean;
  };
  onPurchase: (eac: any) => void;
}

const EacCard: React.FC<EacCardProps> = ({ eac, onPurchase }) => {
  // Determine the commodity type from the eac type
  const commodity = eac.type.toLowerCase().includes('methanol') ? 'methanol' : 'natural gas';
  const unitOfMeasure = getCommodityUnit(commodity);
  
  // Format the quantity display based on commodity type
  const quantityValue = parseInt(eac.quantity.replace(/[^\d]/g, ''));
  const formattedQuantity = formatQuantityWithUnit(quantityValue, commodity);
  
  // Check if organization has assets
  const hasAssets = eac.hasAssets === true; // Only true if explicitly set to true
    
  return (
    <Card key={eac.id} className={`overflow-hidden ${!hasAssets ? 'opacity-60' : ''}`}>
      <CardContent className="p-0">
        <div className={`p-4 border-b ${hasAssets ? 'bg-muted/30' : 'bg-muted/10'}`}>
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">{eac.id}</span>
            <Badge className={hasAssets ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground"}>
              {eac.type}
            </Badge>
          </div>
          <h3 className="font-medium mt-2">{eac.vendor}</h3>
          <p className="text-sm text-muted-foreground">Quantity: {formattedQuantity}</p>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {eac.attributes.map((attr, idx) => (
              <Badge key={idx} variant="outline" className={hasAssets ? "bg-accent/50" : "bg-muted/30 text-muted-foreground"}>
                {attr}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShieldCheck className={`h-4 w-4 mr-1 ${hasAssets ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span className="text-xs text-muted-foreground">
                {hasAssets ? "Verified on blockchain" : "No assets available"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Added: {eac.date}</span>
          </div>
          <div className="flex flex-col space-y-2 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price per {unitOfMeasure}:</span>
              <span className={`text-sm font-bold ${hasAssets ? 'text-green-600' : 'text-muted-foreground'}`}>
                ${eac.price}
              </span>
            </div>
            <Button 
              type="button"
              className="w-full" 
              onClick={() => onPurchase(eac)}
              disabled={!hasAssets}
              variant={hasAssets ? "default" : "outline"}
            >
              {hasAssets ? "Purchase EAC" : "No Assets Available"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EacCard;
