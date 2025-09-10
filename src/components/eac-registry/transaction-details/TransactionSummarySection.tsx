
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '../TransactionDetailsModal';

interface TransactionSummarySectionProps {
  transaction: Transaction;
  isForward: boolean;
  completedDeliveries: number;
  pendingDeliveries: number;
}

const TransactionSummarySection = ({ 
  transaction, 
  isForward, 
  completedDeliveries, 
  pendingDeliveries 
}: TransactionSummarySectionProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Transaction Summary</h3>
        <Badge 
          variant={
            transaction.type === "Transfer" ? "outline" : 
            transaction.type === "Forward" ? "secondary" : 
            "default"
          }
        >
          {transaction.type}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-xs">{transaction.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">{transaction.amount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Timestamp</p>
              <p>{transaction.timestamp}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">QET Number</p>
              <p>{transaction.qet}</p>
            </div>
            
            {isForward && (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Period Start</p>
                  <p>{transaction.periodStart}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Period End</p>
                  <p>{transaction.periodEnd}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Delivery Frequency</p>
                  <p className="capitalize">{transaction.deliveryFrequency}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Delivery Status</p>
                  <p>{completedDeliveries} completed, {pendingDeliveries} pending</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TransactionSummarySection;
