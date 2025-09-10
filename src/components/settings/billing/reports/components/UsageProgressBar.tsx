
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BookOpenText, Pencil, DollarSign } from 'lucide-react';

interface UsageProgressBarProps {
  type: 'read' | 'write';
  usage: number;
  limit: number;
  showOverage?: boolean;
  overageUnits?: number;
  overageCharges?: number;
  overageRate?: number;
}

const UsageProgressBar: React.FC<UsageProgressBarProps> = ({
  type,
  usage,
  limit,
  showOverage = false,
  overageUnits = 0,
  overageCharges = 0,
  overageRate = 0
}) => {
  const isRead = type === 'read';
  const usagePercentage = (usage / limit) * 100;
  const highUsage = usagePercentage > 80;
  const Icon = isRead ? BookOpenText : Pencil;
  const iconColor = isRead ? 'text-blue-500' : 'text-green-500';
  const progressColor = usagePercentage > 90 ? 'bg-destructive' : isRead ? 'bg-blue-500' : 'bg-green-500';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center mb-1">
        <Icon className={`h-4 w-4 mr-2 ${iconColor}`} />
        <h4 className="text-sm font-medium">Words {isRead ? 'Read' : 'Written'}</h4>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">
          {usage.toLocaleString()} / {limit.toLocaleString()} words
        </span>
        <span className={`text-sm font-medium ${highUsage && usagePercentage > 90 ? 'text-destructive' : ''}`}>
          {usagePercentage.toFixed(1)}%
        </span>
      </div>
      <Progress 
        value={usagePercentage > 100 ? 100 : usagePercentage} 
        className="h-2"
        indicatorClassName={progressColor}
      />
      
      {showOverage && (
        <div className={`mt-2 flex items-center text-sm ${isRead ? 'text-destructive' : 'text-amber-600'}`}>
          <DollarSign className="h-4 w-4 mr-1" />
          <span>
            {isRead ? 'Overage' : 'Potential overage'} charges: ${overageCharges.toLocaleString()} 
            ({overageUnits} x ${overageRate} per 750K words)
          </span>
        </div>
      )}
    </div>
  );
};

export default UsageProgressBar;
