
import React from 'react';
import DashboardCard from '@/components/DashboardCard';
import ComplianceStatusChart from '@/components/ComplianceStatusChart';
import RegulationActivity from '@/components/RegulationActivity';

const DataCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardCard 
        title="Compliance Status" 
        description="Overview of your organization's regulatory compliance"
      >
        <ComplianceStatusChart />
      </DashboardCard>
      
      <DashboardCard 
        title="Regulatory Activity" 
        description="Monthly trend of new and updated regulations"
      >
        <RegulationActivity />
      </DashboardCard>
    </div>
  );
};

export default DataCharts;
