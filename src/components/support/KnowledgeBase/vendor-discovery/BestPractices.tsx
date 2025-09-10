
import React from 'react';

const BestPractices = () => {
  return (
    <section className="bg-muted p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
      <ul className="list-disc pl-4 space-y-2">
        <li>Define clear product specifications and requirements before starting the discovery process</li>
        <li>Review and update your organization's policies in the settings to ensure accurate vendor matching</li>
        <li>Use the comparison feature to evaluate multiple vendors side by side</li>
        <li>Allow sufficient response time when sending RFIs (typically 2-4 weeks)</li>
        <li>Monitor the "Onboarding" tab for incoming RFI responses and vendor evaluations</li>
      </ul>
    </section>
  );
};

export default BestPractices;
