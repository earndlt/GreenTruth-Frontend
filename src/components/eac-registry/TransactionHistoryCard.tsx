
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface TransactionHistoryCardProps {
  companyName?: string;
}

const TransactionHistoryCard = ({ companyName }: TransactionHistoryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History {companyName && `- ${companyName}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-4 text-muted-foreground">
          <p>Transaction history will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistoryCard;
