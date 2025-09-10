
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardCard from '@/components/DashboardCard';
import RecentAlerts from '@/components/RecentAlerts';
import { complianceAlerts } from '@/components/compliance/data/alerts';
import { AlertTriangle } from 'lucide-react';

const AlertsAndComplianceSection = () => {
  const navigate = useNavigate();
  const highPriorityAlerts = complianceAlerts.filter(alert => alert.type === 'high').length;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <DashboardCard 
        title={
          <div className="flex items-center justify-between">
            <span>Recent Compliance Alerts</span>
            {highPriorityAlerts > 0 && (
              <div className="flex items-center text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {highPriorityAlerts} High Priority
              </div>
            )}
          </div>
        }
        description="Latest regulatory updates affecting your business"
        footer={
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate('/compliance')}
          >
            View All Alerts
          </Button>
        }
      >
        <RecentAlerts />
      </DashboardCard>
    </div>
  );
};

export default AlertsAndComplianceSection;
