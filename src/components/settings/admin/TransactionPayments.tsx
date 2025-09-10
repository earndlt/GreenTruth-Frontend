
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';
import { usePaymentMethods } from './hooks/usePaymentMethods';
import PaymentMethodsList from './payment/PaymentMethodsList';

const TransactionPayments = () => {
  const {
    isVerifying,
    showVerificationSuccess,
    setShowVerificationSuccess,
    selectedEntityId,
    corporateEntities,
    currentEntity,
    handleChangeEntity,
    handleSetPrimary,
    handleDeleteMethod,
  } = usePaymentMethods();

  return (
    <Card className="mt-8" id="payment-methods">
      <CardHeader>
        <CardTitle>Transaction Payments</CardTitle>
        <CardDescription>
          Configure payment methods for EAC transactions on EarnDLT.
          This is separate from your GreenTruth subscription payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showVerificationSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Payment Method Added</AlertTitle>
            <AlertDescription className="text-green-700">
              Your payment method has been successfully added for EarnDLT transactions.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <Label className="text-base font-medium">Corporate Entity</Label>
          <Select
            value={selectedEntityId}
            onValueChange={handleChangeEntity}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              {corporateEntities.map(entity => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name} {entity.division && `(${entity.division})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PaymentMethodsList
          currentEntity={currentEntity}
          onSetPrimary={handleSetPrimary}
          onDeleteMethod={handleDeleteMethod}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionPayments;
