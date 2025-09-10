
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface RevenueData {
  quarter: string;
  'Base Transactions': number;
  'Secondary Transfers': number;
}

interface RevenueGenerationChartProps {
  data: RevenueData[];
  chartConfig: Record<string, { color: string }>;
}

const RevenueGenerationChart = ({ data, chartConfig }: RevenueGenerationChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Generation</CardTitle>
            <CardDescription>Quarterly breakdown of EAC transaction revenue</CardDescription>
          </div>
          <Tabs defaultValue="quarterly" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Base Transactions" fill={chartConfig['Base Transactions'].color} name="Base Transactions" />
                <Bar dataKey="Secondary Transfers" fill={chartConfig['Secondary Transfers'].color} name="Secondary Transfers" />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueGenerationChart;
