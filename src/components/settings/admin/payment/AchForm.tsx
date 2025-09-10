
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import PlaidLink from './PlaidLink';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface AchFormProps {
  bankName: string;
  setBankName: (value: string) => void;
  accountName: string;
  setAccountName: (value: string) => void;
  routingNumber: string;
  setRoutingNumber: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  // Plaid props
  plaidLinkToken?: string | null;
  onPlaidSuccess?: (publicToken: string, metadata: any) => void;
  onPlaidExit?: () => void;
  isPlaidLoading?: boolean;
}

const AchForm: React.FC<AchFormProps> = ({
  bankName,
  setBankName,
  accountName,
  setAccountName,
  routingNumber,
  setRoutingNumber,
  accountNumber,
  setAccountNumber,
  // Plaid props
  plaidLinkToken,
  onPlaidSuccess,
  onPlaidExit,
  isPlaidLoading = false
}) => {
  return (
    <>
      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          ACH and Wire transfers are the preferred method for high-volume EAC transactions due to lower fees.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="plaid">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="plaid" className="flex-1">Connect with Plaid (Recommended)</TabsTrigger>
          <TabsTrigger value="manual" className="flex-1">Enter Manually</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plaid">
          <div className="p-4 border rounded-md bg-gray-50">
            <h4 className="font-medium mb-2">Secure Bank Authentication</h4>
            <p className="text-sm text-gray-600 mb-4">
              We partner with Plaid to securely connect your bank account. Your credentials are never stored on our servers.
            </p>
            
            {plaidLinkToken && onPlaidSuccess && onPlaidExit ? (
              <PlaidLink 
                linkToken={plaidLinkToken}
                onSuccess={onPlaidSuccess}
                onExit={onPlaidExit}
                isLoading={isPlaidLoading}
              />
            ) : (
              <div className="text-sm text-amber-600">
                Plaid integration is currently unavailable. Please try again later or use manual entry.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="manual">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input 
                  id="bankName" 
                  value={bankName} 
                  onChange={(e) => setBankName(e.target.value)} 
                  placeholder="e.g., Chase Bank"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input 
                  id="accountName" 
                  value={accountName} 
                  onChange={(e) => setAccountName(e.target.value)} 
                  placeholder="e.g., Acme Corporation"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input 
                  id="routingNumber" 
                  value={routingNumber} 
                  onChange={(e) => setRoutingNumber(e.target.value)} 
                  placeholder="9 digits"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber" 
                  value={accountNumber} 
                  onChange={(e) => setAccountNumber(e.target.value)} 
                  placeholder="Your account number"
                  type="password"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AchForm;
