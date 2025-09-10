
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardCard from '@/components/DashboardCard';

const VendorNetworkCard = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardCard 
      title="Vendor Network Insights" 
      description="Summary of your vendor compliance and performance"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
            <p className="text-2xl font-bold">87</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <Users className="h-6 w-6" />
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">COMPLIANCE STATUS</p>
          <div className="flex items-center">
            <div className="w-full h-2.5 bg-muted overflow-hidden rounded-full relative">
              <div className="absolute left-0 top-0 h-full bg-green-500 rounded-l-full" style={{ width: '60%' }}></div>
              <div className="absolute left-[60%] top-0 h-full bg-amber-500" style={{ width: '20%' }}></div>
              <div className="absolute left-[80%] top-0 h-full bg-destructive rounded-r-full" style={{ width: '20%' }}></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>60% Compliant</span>
            <span>20% At Risk</span>
            <span>20% Non-Compliant</span>
          </div>
        </div>
        
        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/vendors')}>
            View Vendor Network
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};

export default VendorNetworkCard;
