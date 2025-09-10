
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const CancelSubscription: React.FC = () => {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const handleCancelSubscription = () => {
    // In a real app, this would call your backend to cancel the subscription
    toast.success('Subscription cancellation initiated');
    setIsConfirmingCancel(false);
    // In a real implementation, this would call your backend which would use the Stripe API
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cancel Subscription</CardTitle>
        <CardDescription>
          Cancel your current subscription plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConfirmingCancel ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Confirm Cancellation</AlertTitle>
            <AlertDescription>
              Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.
            </AlertDescription>
            <div className="flex space-x-2 mt-4">
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Yes, Cancel Subscription
              </Button>
              <Button variant="outline" onClick={() => setIsConfirmingCancel(false)}>
                No, Keep Subscription
              </Button>
            </div>
          </Alert>
        ) : (
          <Button 
            variant="outline" 
            className="text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => setIsConfirmingCancel(true)}
          >
            Cancel Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CancelSubscription;
