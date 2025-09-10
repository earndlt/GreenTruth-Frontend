
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CircleAlert } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface TradingData {
  date: string;
  activity: number;
}

interface TradingActivityChartProps {
  data: TradingData[];
  chartConfig: Record<string, { color: string }>;
}

const TradingActivityChart = ({ data, chartConfig }: TradingActivityChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Daily Trading Activity</CardTitle>
        <CardDescription>Recent EAC trading activity trends from EarnDLT</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="activity" stroke={chartConfig.activity.color} name="Trading Activity" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-6 p-3 bg-muted/50 rounded-md">
          <CircleAlert className="h-4 w-4 text-amber-500" />
          <p className="text-sm text-muted-foreground">
            This data is synced with EarnDLT and reflects the latest registered transactions
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingActivityChart;
