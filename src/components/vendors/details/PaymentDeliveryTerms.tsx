import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor } from '../types/vendorTypes';

interface PaymentDeliveryTermsProps {
  vendor: Vendor;
}

const PaymentDeliveryTerms: React.FC<PaymentDeliveryTermsProps> = ({ vendor }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Payment & Delivery Terms</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground">Payment Terms</p>
            <p>Net 30</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-muted-foreground">EarnDLT Clearing</p>
            <p>Enabled</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentDeliveryTerms;
