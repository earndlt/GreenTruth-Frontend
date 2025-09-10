
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/DashboardCard';

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
  const navigate = useNavigate();
  
  return (
    <DashboardCard 
      title="Procurement Status" 
      description="Overview of your RFP activities and procurement projects"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active RFPs</p>
            <p className="text-2xl font-bold">18</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
            <ShoppingCart className="h-6 w-6" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active</span>
            <span className="font-medium">8</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Draft</span>
            <span className="font-medium">5</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Closed/Awarded</span>
            <span className="font-medium">5</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Active Procurement Projects</h3>
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
        </div>
        
        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/procurement')}>
            View Procurement
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};

export default ProcurementStatusCard;
