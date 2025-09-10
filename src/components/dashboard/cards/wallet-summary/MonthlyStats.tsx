
import React from 'react';

const MonthlyStats = () => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Issued This Month</span>
        <span className="font-medium">132</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Retired This Month</span>
        <span className="font-medium">87</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Pending Transfers</span>
        <span className="font-medium">14</span>
      </div>
    </div>
  );
};

export default MonthlyStats;
