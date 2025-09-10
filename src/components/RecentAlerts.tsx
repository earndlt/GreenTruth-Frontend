
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Info, Check } from 'lucide-react';
import { complianceAlerts } from '@/components/compliance/data/alerts';

const alertTypeIcons = {
  high: <AlertTriangle className="h-5 w-5 text-destructive" />,
  medium: <Info className="h-5 w-5 text-amber-500" />,
  low: <Check className="h-5 w-5 text-green-500" />,
};

const RecentAlerts = () => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-3">
        {complianceAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="mt-0.5">
              {alertTypeIcons[alert.type]}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{alert.title}</p>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecentAlerts;
