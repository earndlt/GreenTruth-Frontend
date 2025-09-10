
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, MapPin, Calendar, Zap, BarChart3 } from 'lucide-react';
import PurchaseEacDialog from '../PurchaseEacDialog';
import { EacData } from '../purchase/types';
import { formatPriceWithUnit, formatQuantityWithUnit } from '@/utils/analytics';

interface EacCardProps {
  eac: EacData;
  index?: number;
  variant?: string;
}

const EacCard: React.FC<EacCardProps> = ({ eac }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const commodity = eac.certType === 'Methanol' ? 'Methanol' : 'Natural Gas';
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{eac.producer}</CardTitle>
          <Badge variant={eac.status === 'available' ? 'default' : 'secondary'}>
            {eac.status === 'available' ? 'Available' : 'Limited'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{eac.deliveryPoint.name}, {eac.deliveryPoint.state}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Available from {eac.availableFrom || 'Now'}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{eac.energySource || 'Renewable'}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatQuantityWithUnit((eac.availableVolume || eac.available), commodity)}</span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="font-medium">{formatPriceWithUnit(eac.price, commodity)}</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {eac.description || 'Environmental Attribute Certificate from renewable natural gas source.'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Purchase EAC</Button>
          </DialogTrigger>
          <PurchaseEacDialog eacData={eac} onClose={handleCloseDialog} />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default EacCard;
