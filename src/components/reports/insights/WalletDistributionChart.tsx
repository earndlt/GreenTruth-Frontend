
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ChartContainer, 
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { walletChartData, chartConfig } from './WalletChartData';

const WalletDistributionChart = () => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">EAC Distribution Trends</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <BarChart data={walletChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Natural Gas" fill="#f97316" stackId="a" />
              <Bar dataKey="LNG" fill="#0ea5e9" stackId="a" />
              <Bar dataKey="Methanol" fill="#14b8a6" stackId="a" />
              <Bar dataKey="Carbon Credits" fill="#22c55e" stackId="a" />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
        <ChartLegend>
          <ChartLegendContent />
        </ChartLegend>
      </div>
      <p className="text-sm text-muted-foreground text-center mt-2">
        Based on your wallet data over the past 4 months
      </p>
    </div>
  );
};

export default WalletDistributionChart;
