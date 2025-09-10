
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 32 },
  { month: 'Jun', count: 28 },
  { month: 'Jul', count: 35 },
  { month: 'Aug', count: 40 },
  { month: 'Sep', count: 43 },
  { month: 'Oct', count: 50 },
  { month: 'Nov', count: 45 },
  { month: 'Dec', count: 48 },
];

const RegulationActivity = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#33C622" fill="#33C62233" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegulationActivity;
