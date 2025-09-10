import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ship, Calendar, DollarSign } from 'lucide-react';
import { LngTerminalData } from '@/components/eac-registry/map/types/pipelineTypes';
import { getAvailableCargosByTerminal } from '@/data/lng-terminals/cargo-data';
import LngCargoCard from './LngCargoCard';

interface LngCargoSectionProps {
  terminal: LngTerminalData;
}

const LngCargoSection: React.FC<LngCargoSectionProps> = ({ terminal }) => {
  const availableCargos = getAvailableCargosByTerminal(terminal.name);
  
  if (availableCargos.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Ship className="h-5 w-5 mr-2 text-orange-500" />
              <CardTitle>LNG Cargos</CardTitle>
            </div>
            <Badge variant="secondary">No Available Cargos</Badge>
          </div>
          <CardDescription>
            Currently no LNG cargos available for reservation at {terminal.name}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Ship className="h-5 w-5 mr-2 text-orange-500" />
            <CardTitle>Available LNG Cargos</CardTitle>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {availableCargos.length} Available
          </Badge>
        </div>
        <CardDescription>
          Reserve LNG cargos with complete environmental attribute certificates
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          {availableCargos.map((cargo) => (
            <LngCargoCard key={cargo.id} cargo={cargo} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LngCargoSection;