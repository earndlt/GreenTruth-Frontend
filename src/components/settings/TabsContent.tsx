
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import BusinessProfileTab from './BusinessProfileTab';
import BillingTab from './BillingTab';
import AdminTab from './AdminTab';
import AccountTab from './AccountTab';
import PreferencesTab from './PreferencesTab';
import { useUser } from '@/context/UserContext';

// Removed ApiAccessTab import as it's relocated.

const SettingsTabsContent = () => {
  const { isAdmin } = useUser();
  
  return (
    <>
      <TabsContent value="account">
        <AccountTab />
      </TabsContent>
      
      <TabsContent value="business-profile">
        <BusinessProfileTab />
      </TabsContent>
      
      <TabsContent value="billing">
        <BillingTab />
      </TabsContent>
      
      <TabsContent value="preferences">
        <PreferencesTab />
      </TabsContent>

      {/* The API tab is moved to support section */}
      {isAdmin && (
        <TabsContent value="admin">
          <AdminTab />
        </TabsContent>
      )}
    </>
  );
};

export default SettingsTabsContent;

