
import React from 'react';

const RfiManagement = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-3">RFI Management</h3>
      <div className="space-y-3">
        <p>
          The RFI feature streamlines the vendor information gathering process:
        </p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Automatically generated vendor-specific questions</li>
          <li>Document request options for certifications, financial information, and insurance</li>
          <li>Customizable response deadlines</li>
          <li>Automated response collection and scoring</li>
          <li>Integration with your organization's vendor onboarding workflow</li>
        </ul>
      </div>
    </section>
  );
};

export default RfiManagement;
