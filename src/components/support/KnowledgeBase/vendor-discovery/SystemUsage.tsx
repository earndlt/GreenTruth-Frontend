
import React from 'react';

const SystemUsage = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-3">Using the Vendor Discovery System</h3>
      <ol className="list-decimal pl-4 space-y-3">
        <li>
          <strong>Initial Search:</strong> Navigate to the Vendors section and select the "Discovery" 
          tab. Enter your search criteria including product type, specifications, and location requirements.
        </li>
        <li>
          <strong>Policy Considerations:</strong> Enable relevant policy checks to ensure vendors 
          are evaluated against your organization's procurement, environmental, and ESG policies.
        </li>
        <li>
          <strong>Review Results:</strong> Browse through matched vendors, comparing their 
          compliance scores and sustainability certifications. The system highlights vendors 
          that best match your requirements.
        </li>
        <li>
          <strong>Send RFIs:</strong> Select one or more vendors and click "Send RFI" to 
          initiate the information request process. The system will generate a draft RFI 
          incorporating your organization's specific requirements.
        </li>
      </ol>
    </section>
  );
};

export default SystemUsage;
