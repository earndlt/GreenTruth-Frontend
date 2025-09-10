
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PreferencesSection from './sections/PreferencesSection';

const PreferencesTab = () => {
  const { toast } = useToast();
  const [complianceAlerts, setComplianceAlerts] = useState(true);
  const [vendorUpdates, setVendorUpdates] = useState(true);
  const [eacTransactions, setEacTransactions] = useState(true);
  const [transactionSuccessEmails, setTransactionSuccessEmails] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Initialize sidebar collapsed state from localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      setSidebarCollapsed(savedSidebarState === 'true');
    }
  }, []);

  const handleToggleChange = (setting: string, value: boolean) => {
    // In a real app, this would call an API to update user preferences
    toast({
      title: `${setting} ${value ? 'enabled' : 'disabled'}`,
      description: "Your preferences have been updated."
    });
  };

  const handleSidebarCollapseToggle = (checked: boolean) => {
    setSidebarCollapsed(checked);
    localStorage.setItem('sidebarCollapsed', checked.toString());
    
    // Dispatch custom event to notify the layout
    const event = new CustomEvent('sidebarToggle', { 
      detail: { collapsed: checked } 
    });
    window.dispatchEvent(event);
    
    toast({
      title: checked ? "Sidebar collapsed" : "Sidebar expanded",
      description: "Your preference has been saved.",
      duration: 2000,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Interface Preferences</CardTitle>
          </div>
          <CardDescription>
            Customize your GreenTruth experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sidebar-collapsed">Collapsed Sidebar by Default</Label>
              <p className="text-sm text-muted-foreground">
                Start with sidebar collapsed
              </p>
            </div>
            <Switch 
              id="sidebar-collapsed" 
              checked={sidebarCollapsed}
              onCheckedChange={handleSidebarCollapseToggle}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
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
      
      <PreferencesSection />
    </div>
  );
};

export default PreferencesTab;
