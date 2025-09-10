
import React from 'react';
import RfpCard from './RfpCard';

interface RfpsTabProps {
  companyId: string;
}

const RfpsTab: React.FC<RfpsTabProps> = ({ companyId }) => {
  // Mock data - in a real app, this would be fetched based on companyId
  const rfps = [
    {
      id: '1',
      title: 'RNG Supply for Q3-Q4 2025',
      description: 'Seeking quality RNG supply for latter half of 2025.',
      status: 'active',
      statusType: 'success' as const,
      dueDate: '2025-05-15',
      responses: 4
    },
    {
      id: '2',
      title: 'Carbon Credits - Forestry Projects',
      description: 'Looking for carbon credits from validated forestry projects.',
      status: 'active',
      statusType: 'warning' as const,
      dueDate: '2025-04-30',
      responses: 2
    }
  ];

  return (
    <div className="space-y-4">
      {rfps.length > 0 ? (
        rfps.map(rfp => (
          <RfpCard 
            key={rfp.id}
            title={rfp.title}
            description={rfp.description}
            status={rfp.status}
            statusType={rfp.statusType}
            dueDate={rfp.dueDate}
            responses={rfp.responses}
            onView={() => console.log(`View RFP ${rfp.id}`)}
            onManage={() => console.log(`Manage RFP ${rfp.id}`)}
          />
        ))
      ) : (
        <div className="text-center p-10 text-muted-foreground">
          No active RFPs for this company. Create a new RFP to get started.
        </div>
      )}
    </div>
  );
};

export default RfpsTab;
