
import React from 'react';
import EntityManagement from './admin/EntityManagement';
import KycOverview from './admin/KycOverview';
import UserManagement from './admin/UserManagement';
import TransactionPayments from './admin/TransactionPayments';
import RegulationsIntegration from './admin/RegulationsIntegration';

const AdminTab = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Administration</h2>
      <p className="text-muted-foreground">
        Manage corporate entities, users, KYC verification processes, payment methods for transactions, and data integrations.
      </p>
      <div id="kyb">
        <KycOverview />
      </div>
      <UserManagement />
      <EntityManagement />
      {/* <RegulationsIntegration /> */}
      <TransactionPayments />
    </div>
  );
};

export default AdminTab;
