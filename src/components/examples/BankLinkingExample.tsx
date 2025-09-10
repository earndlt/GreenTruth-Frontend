import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import PlaidLink from '@/components/settings/billing/PlaidLink';
import { PlaidService } from '@/services/plaidService';
import { useAuth } from '@/context/AuthContext';

interface BankAccount {
  _id: string;
  bankName: string;
  accountType: string;
  accountLast4: string;
  isDefault: boolean;
  isActive: boolean;
}

const BankLinkingExample: React.FC = () => {
  const { user } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLinking, setIsLinking] = useState(false);

  const handlePlaidSuccess = async (publicToken: string, metadata: any) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setIsLinking(true);
    try {
      // Link bank account through backend
      const bankAccount = await PlaidService.linkBankAccount(
        publicToken,
        metadata.account.id,
        user.id,
        user.email,
        user.name || user.email
      );

      // Add to bank accounts list
      const newBankAccount: BankAccount = {
        _id: bankAccount._id,
        bankName: bankAccount.bankName,
        accountType: bankAccount.accountType,
        accountLast4: bankAccount.accountLast4,
        isDefault: bankAccount.isDefault,
        isActive: bankAccount.isActive,
      };

      setBankAccounts(prev => [...prev, newBankAccount]);
      
      toast.success(`Successfully connected to ${bankAccount.bankName}!`);
    } catch (error: any) {
      console.error("Error linking bank account:", error);
      toast.error(error.message || "Failed to link bank account");
    } finally {
      setIsLinking(false);
    }
  };

  const handlePlaidExit = () => {
    console.log("Plaid Link exited");
    toast.info("Bank linking cancelled");
  };

  const handleRemoveBankAccount = (accountId: string) => {
    setBankAccounts(prev => prev.filter(account => account._id !== accountId));
    toast.success("Bank account removed");
  };

  const handleSetDefault = (accountId: string) => {
    setBankAccounts(prev => 
      prev.map(account => ({
        ...account,
        isDefault: account._id === accountId
      }))
    );
    toast.success("Default bank account updated");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Bank Account Linking</h1>
        <p className="text-muted-foreground mt-2">
          Securely connect your bank accounts for ACH payments
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bank Linking Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Connect Bank Account
            </CardTitle>
            <CardDescription>
              Link your bank account securely using Plaid. Your banking credentials are never stored on our servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Benefits of ACH Payments:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Lower processing fees compared to credit cards</li>
                <li>• Secure bank-level authentication</li>
                <li>• Faster settlement times</li>
                <li>• No credit card limits</li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">Security & Privacy:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bank-level security encryption</li>
                <li>• Credentials never stored on our servers</li>
                <li>• Read-only access to account information</li>
                <li>• Plaid's industry-standard security</li>
              </ul>
            </div>

            <PlaidLink
              onSuccess={handlePlaidSuccess}
              onExit={handlePlaidExit}
              disabled={isLinking}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Connected Accounts
            </CardTitle>
            <CardDescription>
              Manage your connected bank accounts and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bankAccounts.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bank accounts connected yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect your first bank account to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <div
                    key={account._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.accountType} •••• {account.accountLast4}
                          </p>
                        </div>
                      </div>
                      {account.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                      {account.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!account.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(account._id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveBankAccount(account._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Learn about the bank linking process and security measures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h4 className="font-medium">Connect</h4>
              <p className="text-sm text-muted-foreground">
                Click "Connect Your Bank Account" to launch Plaid Link
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h4 className="font-medium">Authenticate</h4>
              <p className="text-sm text-muted-foreground">
                Log in to your bank through Plaid's secure interface
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h4 className="font-medium">Verify</h4>
              <p className="text-sm text-muted-foreground">
                Select your account and complete the verification process
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankLinkingExample; 