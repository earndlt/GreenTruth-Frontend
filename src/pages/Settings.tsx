
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, CreditCard, Shield, Users, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/context/UserContext';
import SettingsTabsContent from '@/components/settings/TabsContent';

// Define which tabs require admin access
const ADMIN_ONLY_TABS = ['business-profile', 'billing', 'admin'];

const Settings = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useUser();

  useEffect(() => {
    // Get the tab from URL params, default to 'account' if not specified
    const tab = searchParams.get('tab');

    if (tab) {
      // Check if the requested tab requires admin access
      if (ADMIN_ONLY_TABS.includes(tab) && !isAdmin) {
        // Redirect to account tab if user is not an admin
        navigate('/settings?tab=account', { replace: true });
        return;
      }

      if (['account', 'business-profile', 'preferences', 'billing', 'admin'].includes(tab)) {
        setActiveTab(tab);
      }
    }

    // Handle hash fragment for scrolling to specific sections
    const hash = location.hash;
    if (hash) {
      // Wait for the component to render, then scroll to the element
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams, isAdmin, navigate, location.hash]);

  const handleTabChange = (value: string) => {
    // If tab requires admin access and user is not admin, don't change tab
    if (ADMIN_ONLY_TABS.includes(value) && !isAdmin) {
      return;
    }

    setActiveTab(value);
    navigate(`/settings?tab=${value}`);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {!isAdmin && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Restricted Access</AlertTitle>
          <AlertDescription>
            Some settings are only accessible to administrators. Contact your admin for assistance.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="business-profile" disabled={!isAdmin}>
            <Building className="h-4 w-4 mr-1.5" />
            Business Profile
          </TabsTrigger>
          {/* <TabsTrigger value="billing" disabled={!isAdmin}>
            <CreditCard className="h-4 w-4 mr-1.5" />
            Billing & Subscription
          </TabsTrigger> */}
          <TabsTrigger value="preferences">
            <SettingsIcon className="h-4 w-4 mr-1.5" />
            Preferences & Notifications
          </TabsTrigger>
          {/* Removed API tab, as this is now accessible from Help & Support */}
          {isAdmin && (
            <TabsTrigger value="admin">
              <Users className="h-4 w-4 mr-1.5" />
              Admin
            </TabsTrigger>
          )}
        </TabsList>

        <SettingsTabsContent />
      </Tabs>
    </div>
  );
};

export default Settings;

