
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../utils/formatUtils';

interface UsageBarChartProps {
  data: Array<{
    [key: string]: any;
  }>;
  xAxisKey: string;
  barKeys: { key: string; name: string; color: string }[];
  height?: number;
}

const UsageBarChart: React.FC<UsageBarChartProps> = ({ 
  data, 
  xAxisKey, 
  barKeys,
  height = 320
}) => {
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip formatter={(value) => formatNumber(value as number)} />
          <Legend />
          {barKeys.map((barKey) => (
            <Bar 
              key={barKey.key}
              dataKey={barKey.key} 
              fill={barKey.color} 
              name={barKey.name} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageBarChart;
