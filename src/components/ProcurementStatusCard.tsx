
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProcurementItem {
  id: number;
  title: string;
  status: 'draft' | 'pending' | 'approved' | 'completed';
  progressPercentage: number;
}

const items: ProcurementItem[] = [
  {
    id: 1,
    title: 'Renewable Energy Procurement',
    status: 'pending',
    progressPercentage: 65,
  },
  {
    id: 2,
    title: 'Sustainable Materials RFP',
    status: 'draft',
    progressPercentage: 30,
  },
  {
    id: 3,
    title: 'Green Logistics Vendor Selection',
    status: 'approved',
    progressPercentage: 85,
  },
];

const getStatusColor = (status: ProcurementItem['status']) => {
  switch (status) {
    case 'draft':
      return 'text-muted-foreground';
    case 'pending':
      return 'text-amber-500';
    case 'approved':
      return 'text-teal-500';
    case 'completed':
      return 'text-emerald-500';
    default:
      return 'text-muted-foreground';
  }
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 50) return 'bg-teal-500';
  return 'bg-secondary';
};

const ProcurementStatusCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Active Procurement Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.title}</span>
                <span className={`text-xs font-medium uppercase ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <Progress 
                value={item.progressPercentage} 
                className={cn("h-2", getProgressColor(item.progressPercentage))}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcurementStatusCard;
