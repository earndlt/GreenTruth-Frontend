import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ship, MapPin, Clock, Package } from 'lucide-react';
import { LngTerminalData } from '@/components/eac-registry/map/types/pipelineTypes';

interface LngTerminalInfoProps {
  terminal: LngTerminalData;
}

const LngTerminalInfo: React.FC<LngTerminalInfoProps> = ({ terminal }) => {
  return (
    <Card className="border-orange-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Ship className="h-5 w-5 mr-2 text-orange-500" />
            <CardTitle className="text-lg">{terminal.name}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            LNG Terminal
          </Badge>
        </div>
        <CardDescription>{terminal.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Location</div>
                <div className="text-sm text-muted-foreground">{terminal.county}, {terminal.state}</div>
              </div>
            </div>
            
            {terminal.cargoFrequency && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Cargo Frequency</div>
                  <div className="text-sm text-muted-foreground">{terminal.cargoFrequency}</div>
                </div>
              </div>
            )}
            
            {terminal.availableCargos && (
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Available Cargos</div>
                  <div className="text-sm font-semibold text-green-600">{terminal.availableCargos}</div>
                </div>
              </div>
            )}
            
            {terminal.cargoPrice && (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 text-green-600 font-bold">$</div>
                <div>
                  <div className="text-sm font-medium">Current Price</div>
                  <div className="text-sm font-semibold text-green-600">{terminal.cargoPrice}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LngTerminalInfo;