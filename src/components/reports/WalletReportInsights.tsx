
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WalletMetricsCards from './insights/WalletMetricsCards';
import WalletDistributionChart from './insights/WalletDistributionChart';

const WalletReportInsights = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>EAC Wallet Report Insights</CardTitle>
        <CardDescription>
          Analysis of your EAC wallet activity for potential reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WalletMetricsCards />
        <WalletDistributionChart />
      </CardContent>
    </Card>
  );
};

export default WalletReportInsights;
