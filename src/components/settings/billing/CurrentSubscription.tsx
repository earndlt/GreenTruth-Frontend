
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CreditCard, FileText, Users } from 'lucide-react';

interface CurrentSubscriptionProps {
  currentPlan: string;
  planCost: string;
}

const CurrentSubscription: React.FC<CurrentSubscriptionProps> = ({ currentPlan, planCost }) => {
  // Map plan IDs to display names
  const planNames: Record<string, string> = {
    basic: 'Basic',
    pro: 'Pro',
    team: 'Team',
    business: 'Business',
    enterprise: 'Enterprise'
  };

  // Map plan IDs to seat counts
  const planSeats: Record<string, string> = {
    pro: '1',
    team: '5',
    business: '15',
    enterprise: 'Custom'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          Manage your GreenTruth subscription plan and billing preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Current Plan: </span>
            <span className="text-primary font-semibold">
              {planNames[currentPlan]} ({planCost}/{currentPlan === 'enterprise' ? 'custom' : 'month'})
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Next Billing Date: </span>
            <span>May 15, 2025</span>
          </div>
          
          {currentPlan !== 'basic' && (
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">User Seats: </span>
              <span>{planSeats[currentPlan] || '1'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentSubscription;
