
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getCommodityUnit } from '@/utils/analytics';

interface SummaryMetricsCardsProps {
  walletTotals: {
    totalEacs: number;
    naturalGas: number;
    lng: number;
    thermalCredits: number;
    methanol?: number;
  };
}

const SummaryMetricsCards = ({ walletTotals }: SummaryMetricsCardsProps) => {
  const naturalGasUnit = getCommodityUnit('natural gas');
  const lngUnit = getCommodityUnit('lng');
  const thermalCreditsUnit = getCommodityUnit('thermal credits');
  const methanolUnit = getCommodityUnit('methanol');
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">Total EACs</p>
            <p className="text-3xl font-bold">{walletTotals.totalEacs.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total certified volume</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">Natural Gas EACs</p>
            <p className="text-3xl font-bold text-orange-500">{walletTotals.naturalGas.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{naturalGasUnit} certified</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">LNG EACs</p>
            <p className="text-3xl font-bold text-sky-500">{walletTotals.lng.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{lngUnit} certified</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">
              {walletTotals.methanol ? 'Methanol EACs' : 'Carbon Credits'}
            </p>
            <p className="text-3xl font-bold text-green-500">
              {walletTotals.methanol ? 
                walletTotals.methanol.toLocaleString() : 
                walletTotals.thermalCredits.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {walletTotals.methanol ? 
                `${methanolUnit} certified` : 
                `${thermalCreditsUnit} equivalent`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryMetricsCards;
