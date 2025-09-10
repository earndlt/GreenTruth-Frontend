
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import TwoFactorAuthSettings from "./security/TwoFactorAuthSettings";
import { useUser } from '@/context/UserContext';

const NotificationsTab = () => {
  const { toast } = useToast();
  const { userSettings, updateUserSettings } = useUser();
  const [complianceAlerts, setComplianceAlerts] = useState(true);
  const [vendorUpdates, setVendorUpdates] = useState(true);
  const [eacTransactions, setEacTransactions] = useState(true);
  const [transactionSuccessEmails, setTransactionSuccessEmails] = useState(false);
  
  const handleToggleChange = (setting: string, value: boolean) => {
    // In a real app, this would call an API to update user preferences
    toast({
      title: `${setting} ${value ? 'enabled' : 'disabled'}`,
      description: "Your notification preferences have been updated."
    });
  };

  const handle2FAChange = (enabled: boolean) => {
    console.log("NotificationsTab 2FA change:", enabled);
    updateUserSettings({ twoFactorEnabled: enabled });
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Configure when and how you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compliance-alerts">Compliance Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify when compliance status changes
              </p>
            </div>
            <Switch 
              id="compliance-alerts" 
              checked={complianceAlerts}
              onCheckedChange={(checked) => {
                setComplianceAlerts(checked);
                handleToggleChange('Compliance alerts', checked);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="vendor-updates">Vendor Updates</Label>
              <p className="text-sm text-muted-foreground">
                Notify when vendors update their information
              </p>
            </div>
            <Switch 
              id="vendor-updates" 
              checked={vendorUpdates}
              onCheckedChange={(checked) => {
                setVendorUpdates(checked);
                handleToggleChange('Vendor updates', checked);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="eac-transactions">EAC Transactions</Label>
              <p className="text-sm text-muted-foreground">
                Notify about new EAC transactions
              </p>
            </div>
            <Switch 
              id="eac-transactions" 
              checked={eacTransactions}
              onCheckedChange={(checked) => {
                setEacTransactions(checked);
                handleToggleChange('EAC transaction notifications', checked);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="transaction-success-emails" className="font-medium">Transaction Success Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications when transactions are completed successfully
              </p>
            </div>
            <Switch 
              id="transaction-success-emails" 
              checked={transactionSuccessEmails}
              onCheckedChange={(checked) => {
                setTransactionSuccessEmails(checked);
                handleToggleChange('Transaction success emails', checked);
              }}
            />
          </div>
        </CardContent>
      </Card>
      <TwoFactorAuthSettings onChange={handle2FAChange} />
    </div>
  );
};

export default NotificationsTab;
