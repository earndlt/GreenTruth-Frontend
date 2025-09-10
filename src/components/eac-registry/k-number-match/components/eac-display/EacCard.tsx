
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
import { MatchedEAC } from '../../types';
import { getReceiptLocationNameById } from '../../utils/receiptLocations';

interface EacCardProps {
  eac: MatchedEAC;
  selectedPipeline: "REX" | "Ruby";
}

const EacCard: React.FC<EacCardProps> = ({ eac, selectedPipeline }) => {
  console.log("Rendering EacCard:", eac.id);
  
  // Handle receipt location ID properly
  const receiptLocationId = typeof eac.receiptLocationId === 'string' ? eac.receiptLocationId : undefined;
  const receiptLocationName = receiptLocationId ? getReceiptLocationNameById(receiptLocationId) : null;

  // Format emission point name for better display
  const formatEmissionPoint = (point: string) => {
    if (point === 'thermal') return 'Thermal';
    return point.charAt(0).toUpperCase() + point.slice(1);
  };

  return (
    <Card className="border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="bg-slate-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{eac.id}</h3>
          <p className="text-sm text-green-600 font-medium">{formatEmissionPoint(eac.emissionPoint)}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold">{formatNumber(eac.volume)} MMBtu</span>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-2 flex-grow">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm text-gray-500">Contract ID:</div>
          <div className="text-sm font-medium text-right">K# {eac.contractId}</div>
          
          <div className="text-sm text-gray-500">Source:</div>
          <div className="text-sm font-medium text-right">{eac.sourceFacility}</div>
          
          <div className="text-sm text-gray-500">Daily Volume:</div>
          <div className="text-sm font-medium text-right">
            {eac.dailyVolume ? formatNumber(eac.dailyVolume) + ' MMBtu/day' : 'N/A'}
          </div>
          
          <div className="text-sm text-gray-500">Emission Factor:</div>
          <div className="text-sm font-medium text-right">{eac.emissionFactor}</div>
          
          <div className="text-sm text-gray-500">Time Range:</div>
          <div className="text-sm font-medium text-right">{eac.timeRange}</div>
          
          {eac.pricePerMMBtu && (
            <>
              <div className="text-sm text-gray-500">Price per MMBtu:</div>
              <div className="text-sm font-medium text-right">${eac.pricePerMMBtu}</div>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {(eac.emissionPoint === 'thermal' && eac.qetCompatible) && (
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              Carbon Offset
            </Badge>
          )}
          
          {selectedPipeline === 'REX' && receiptLocationName && (
            <Badge variant="outline" className="text-xs font-normal">
              {receiptLocationName}
            </Badge>
          )}
          
          {eac.qetCompatible && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              QET Compatible
            </Badge>
          )}
        </div>
        
        {eac.counterparty?.name && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Counterparty: </span>
            <span className="text-xs font-medium">
              {eac.counterparty.name}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EacCard;
