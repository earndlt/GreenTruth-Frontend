
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsHeaderProps {
  onRefreshData: () => void;
  onExportData: () => void;
  isRefreshing: boolean;
}

const AnalyticsHeader = ({ onRefreshData, onExportData, isRefreshing }: AnalyticsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold">EAC Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time insights from your EarnDLT registered EACs
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefreshData}
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
        <Button 
          variant="outline" 
          onClick={onExportData}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
