
import React from 'react';

const CoreFeatures = () => {
  return (
    <section className="mt-4 mb-6 pdf-section">
      <h3 className="text-xl font-medium mb-3">Core Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">EAC Registry & Management</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Real-time EAC tracking and monitoring</li>
            <li>Pipeline mapping visualization</li>
            <li>Spot purchases and forward contracts</li>
            <li>Certificate retirement management</li>
            <li>Wallet-based certificate storage</li>
          </ul>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Procurement Workflows</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>RFI/RFP management</li>
            <li>Vendor discovery and matching</li>
            <li>Product procurement policies</li>
            <li>Bid evaluation and comparison</li>
            <li>Contract automation</li>
          </ul>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Compliance Management</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Regulatory tracking and alerts</li>
            <li>Compliance reporting</li>
            <li>Policy management</li>
            <li>Audit trail documentation</li>
            <li>Risk assessment tools</li>
          </ul>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Analytics & Reporting</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Position reporting</li>
            <li>Transaction volume analytics</li>
            <li>Emissions reporting</li>
            <li>Market trend analysis</li>
            <li>Custom report generation</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
