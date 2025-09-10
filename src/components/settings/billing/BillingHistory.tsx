
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface BillingHistoryProps {
  planCost: string;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ planCost }) => {
  const handleViewInvoices = () => {
    // In a real app, this would navigate to an invoices page or open a modal
    toast.success('Loading invoice history...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>
          View and download your previous invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 hover:bg-muted rounded cursor-pointer">
            <div>
              <p className="font-medium">Invoice #GRT-2025-0412</p>
              <p className="text-sm text-muted-foreground">April 12, 2025</p>
            </div>
            <div className="flex items-center">
              <span className="mr-4">{planCost}</span>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-muted rounded cursor-pointer">
            <div>
              <p className="font-medium">Invoice #GRT-2025-0312</p>
              <p className="text-sm text-muted-foreground">March 12, 2025</p>
            </div>
            <div className="flex items-center">
              <span className="mr-4">{planCost}</span>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </div>
        <Button onClick={handleViewInvoices} variant="outline" className="mt-4">
          View All Invoices
        </Button>
      </CardContent>
    </Card>
  );
};

export default BillingHistory;
