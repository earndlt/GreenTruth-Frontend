
import React from 'react';

const GettingStarted = () => {
  return (
    <section className="border-t pt-4">
      <h3 className="text-xl font-medium mb-3">Getting Started</h3>
      <p className="text-sm text-muted-foreground mb-4">
        To begin using GreenTruth effectively, we recommend these first steps:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm">
        <li><span className="font-medium">Complete your business profile</span>: Configure your company details in Settings → Business Profile.</li>
        <li><span className="font-medium">Set up payment methods</span>: Add payment methods in Settings → Admin → Transaction Payments.</li>
        <li><span className="font-medium">Configure user roles</span>: Set up team members with appropriate access levels in Settings → Admin → User Management.</li>
        <li><span className="font-medium">Explore the EAC Registry</span>: Familiarize yourself with available certificates and the marketplace.</li>
        <li><span className="font-medium">Review documentation</span>: Explore the Knowledge Base for detailed guides on specific features.</li>
      </ol>
    </section>
  );
};

export default GettingStarted;
