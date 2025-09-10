
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardCard from '@/components/DashboardCard';

const ProcurementAndProtocolSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DashboardCard 
        title="QET Protocol Integration" 
        description="EarnDLT integration status"
        className="lg:col-span-3"
      >
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full eco-gradient flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium">EarnDLT QET Protocol</h3>
              <p className="text-sm text-muted-foreground">Connected and operational</p>
              <div className="mt-2 flex space-x-4">
                <div>
                  <p className="text-xs text-muted-foreground">Active Transactions</p>
                  <p className="text-lg font-medium">854,291</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Latency</p>
                  <p className="text-lg font-medium">0.28s</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue Generated</p>
                  <p className="text-lg font-medium">$42,715</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">BLOCKCHAIN HEALTH</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>98% Uptime</span>
                <span>1.2M Transactions/day capacity</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => window.open('https://earndlt.example.com/account', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Access EarnDLT Account
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default ProcurementAndProtocolSection;

