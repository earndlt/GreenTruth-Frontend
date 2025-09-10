
import React from 'react';
import KeyFeatures from './vendor-discovery/KeyFeatures';
import SystemUsage from './vendor-discovery/SystemUsage';
import RfiManagement from './vendor-discovery/RfiManagement';
import BestPractices from './vendor-discovery/BestPractices';

const VendorDiscoveryArticle = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Vendor Discovery & RFI Process</h2>
        <p className="text-muted-foreground mb-4">
          GreenTruth's vendor discovery system helps organizations find and evaluate vendors 
          that align with their business requirements and sustainability goals.
        </p>
      </section>

      <KeyFeatures />
      <SystemUsage />
      <RfiManagement />
      <BestPractices />
    </div>
  );
};

export default VendorDiscoveryArticle;
